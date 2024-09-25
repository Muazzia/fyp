const Order = require("../../../models/order");
const sequelize = require("../../../database");
const OrderedProducts = require("../../../models/orderedProducts");
const Product = require("../../../models/product");
const User = require("../../../models/user");
const { resWrapper, isValidUuid } = require("../../../utils");

const includeObj = {
    include: [
        { model: OrderedProducts, as: "orderedProducts", include: { model: Product, as: "product", attributes: { exclude: ['stock'] } } },
        { model: User, as: "user", attributes: ["id", "firstName", "lastName", "email", "profilePic"] }
    ]
}

const getAllOrders = async (req, res) => {
    const orders = await Order.findAll({
        ...includeObj
    });

    return res.status(200).send(resWrapper("All Orders Reterived", 200, orders))
};

const getAOrderDetail = async (req, res) => {
    const id = req.params.id;

    if (!isValidUuid(id, res)) return;

    const order = await Order.findOne({
        where: {
            id,
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


        await order.destroy({ transaction: t });

        return order;
    })

    return res.status(200).send(resWrapper("Order Deleted Successfully", 200, result))
}

module.exports = {
    getAllOrders,
    getAOrderDetail,
    deleteAOrder,
}