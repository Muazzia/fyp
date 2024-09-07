const sequelize = require("../database");
const { validateCreateOrder } = require("../joiSchemas/order");
const Order = require("../models/order");
const Product = require("../models/product");
const { resWrapper, isValidUuid } = require("../utils");
const validator = require("validator");

const getAllOrdersOfAUser = async (req, res) => {
    const userId = req.userId;

    const orders = await Order.findAll({
        where: {
            userId
        }
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
        }
    });
    if (!order) return res.status(400).send(resWrapper("Order Not Found.", 404, null, "Id is not valid"))

    return res.status(200).send(resWrapper("Order Reterived", 200, order))
}

const deleteAOrder = async (req, res) => {
    const userId = req.userId;
    const id = req.params.id;

    if (!isValidUuid(id)) return;

    const order = await Order.findOne({
        where: {
            id,
            userId
        }
    });
    if (!order) return res.status(400).send(resWrapper("Order Not Found.", 404, null, "Id is not valid"))
    if (order.status !== "pending") return res.status(400).send(resWrapper("Orders Can be Deleted Only when pending.", 400, null, "Order can't be deletd After status is pending"));


    await order.destroy();
    return res.status(200).send(resWrapper("Order Deleted Successfullu", 200, order))
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

            if (!validator.isUUID(item)) {
                skip = true
                return res.status(400).send(resWrapper("Invalid Uuid", 400, null, `Invalid Uuid ${item}`))
            }


            const product = await Product.findByPk(item, { transaction: t });
            if (!product) {
                skip = true
                return res.status(400).send(resWrapper("Invalid Uuid", 400, null, `Product with ID ${item} not found`))
            }

            if (product.stock < 1) {
                skip = true
                return res.status(400).send(resWrapper("Insufficient Stock", 400, null, `Insufficient stock for product ${product.name} with Id: ${item}`))
            }

            totalAmount += product.price;


            await Product.update(
                { stock: product.stock - 1 },
                { where: { id: item }, transaction: t }
            );
        }

        const order = await Order.create({
            userId: req.userId,  // Assuming user ID is available in req.user
            totalAmount,
            status: 'pending',
            shippingAddress,
        }, { transaction: t });

        return order;
    });

    return res.status(201).send(resWrapper("Order Placed Successfully", 201, result));
}

module.exports = {
    getAllOrdersOfAUser,
    getAOrderDetail,
    deleteAOrder,
    createAnOrder
}