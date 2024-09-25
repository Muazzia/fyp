const sequelize = require("../database");
const { validateCreateOrder } = require("../joiSchemas/order");
const Order = require("../models/order");
const OrderedProducts = require("../models/orderedProducts");
const Product = require("../models/product");
const User = require("../models/user");
const { resWrapper, isValidUuid } = require("../utils");
const validator = require("validator");

const includeObj = {
    include: [
        { model: OrderedProducts, as: "orderedProducts", include: { model: Product, as: "product", attributes: { exclude: ['stock'] } } },
        { model: User, as: "user", attributes: ["id", "firstName", "lastName", "email", "profilePic"] }
    ]
}

const getAllOrdersOfAUser = async (req, res) => {
    const userId = req.userId;

    const orders = await Order.findAll({
        where: {
            userId
        },
        ...includeObj
    });

    return res.status(200).send(resWrapper("All Orders Reterived", 200, orders))
};

const getAOrderDetail = async (req, res) => {
    const id = req.params.id;
    const userId = req.userId;

    if (!isValidUuid(id, res)) return;

    const order = await Order.findOne({
        where: {
            id,
            userId
        },
        ...includeObj
    });
    if (!order) return res.status(400).send(resWrapper("Order Not Found.", 404, null, "Id is not valid"))

    return res.status(200).send(resWrapper("Order Reterived", 200, order))
}

const deleteAOrder = async (req, res) => {
    const userId = req.userId;
    const id = req.params.id;

    if (!isValidUuid(id, res)) return;

    const order = await Order.findOne({
        where: {
            id,
            userId
        },
        ...includeObj
    });
    if (!order) return res.status(400).send(resWrapper("Order Not Found.", 404, null, "Id is not valid"))

    if (order.status !== "pending") return res.status(400).send(resWrapper("Orders Can be Deleted Only when pending.", 400, null, "Order can't be deletd After status is pending"));

    let skip = false;
    const result = await sequelize.transaction(async t => {
        const allOrderedProducts = await OrderedProducts.findAll({
            where: {
                orderId: order.id
            }
        });

        for (const orderedProduct of allOrderedProducts) {
            if (skip) break;
            const productId = orderedProduct.productId;

            // Add the ordered quantity back to the stock
            const product = await Product.findByPk(productId);
            if (!product) {
                skip = true
                return res.status(400).send(resWrapper("Invalid Uuid", 400, null, `Product with ID ${productId} not found`))
            }

            const newQuantity = product.stock + orderedProduct.count;
            await product.update({ stock: newQuantity }, { transaction: t });
        }


        await order.update({ status: "cancelled" }, { transaction: t });

        return order;
    })

    return res.status(200).send(resWrapper("Order Cancelled Successfully", 200, result))
}

const createAnOrder = async (req, res) => {
    const { error, value: {
        productsIds, shippingAddress
    } } = validateCreateOrder(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message))


    let totalAmount = 0;
    let skip = false
    const result = await sequelize.transaction(async t => {
        for (const item of productsIds) {
            if (skip) break;

            if (!validator.isUUID(item.id)) {
                skip = true
                return res.status(400).send(resWrapper("Invalid Uuid", 400, null, `Invalid Uuid ${item.id}`))
            }


            const product = await Product.findByPk(item.id, { transaction: t });
            if (!product) {
                skip = true
                return res.status(400).send(resWrapper("Invalid Uuid", 400, null, `Product with ID ${item.id} not found`))
            }

            if (product.stock < item.count) {
                skip = true
                return res.status(400).send(resWrapper("Insufficient Stock", 400, null, `Insufficient stock for product ${product.name} with Id: ${item.id}`))
            }

            totalAmount += product.price * item.count;


            await Product.update(
                { stock: product.stock - item.count },
                { where: { id: item.id }, transaction: t }
            );

        }

        const order = await Order.create({
            userId: req.userId,  // Assuming user ID is available in req.user
            totalAmount,
            status: 'pending',
            shippingAddress,
        }, { transaction: t });

        const orderedProductsData = productsIds.map(item => ({
            orderId: order.id,
            productId: item.id,
            count: item.count
        }));

        await OrderedProducts.bulkCreate(orderedProductsData, { transaction: t });

        return order;
    });


    if (skip) return

    const temp = await Order.findByPk(result.id, {
        ...includeObj
    });

    return res.status(201).send(resWrapper("Order Placed Successfully", 201, temp));
}

module.exports = {
    getAllOrdersOfAUser,
    getAOrderDetail,
    deleteAOrder,
    createAnOrder
}