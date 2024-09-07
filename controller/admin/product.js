const { validateCreateProduct, validateUpdateProduct } = require("../../joiSchemas/admin/product");
const Product = require("../../models/product");
const { resWrapper, isValidUuid } = require("../../utils");
const { uploadSingleToCloudinary } = require("../../utils/cloudinary");


const getAllproducts = async (req, res) => {
    const products = await Product.findAll();

    return res.status(200).send(resWrapper("All Products", 200, products))
};

const getAProduct = async (req, res) => {
    const id = req.params.id;

    if (!isValidUuid(id, res)) return;

    const product = await Product.findByPk(id)
    if (!product) return res.status(404).send(resWrapper("Product Didn't Found", 404, null, "Id Is Not Valid"))

    return res.status(200).send("Product Reterived", 200, product)
};

const deleteAProduct = async (req, res) => {
    const id = req.params.id;

    if (!isValidUuid(id, res)) return;

    const product = await Product.findByPk(id)
    if (!product) return res.status(404).send(resWrapper("Product Didn't Found", 404, null, "Id Is Not Valid"))


    await product.destroy();
    return res.status(200).send(resWrapper("Product Deleted", 200, product))
}

const createAProduct = async (req, res) => {
    const { error, value } = validateCreateProduct(req.body);
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message))

    const { isSuccess, data, error: cloudError } = await uploadSingleToCloudinary(req.file, "product")
    if (!isSuccess) return res.status(400).send(resWrapper("Failed to upload image", 400, null, cloudError));

    const product = await Product.create({ ...value, imageUrl: data });

    return res.status(201).send(resWrapper("Product Created", 200, product));
}

const updateAProduct = async (req, res) => {
    const { error, value } = validateUpdateProduct(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message))

    if (!isValidUuid(req.params.id, res)) return;

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(400).send(resWrapper("Product Not Found", 404, null, "Id Is Not Valid"))

    if (req.file) {
        let { isSuccess, data } = await uploadSingleToCloudinary(req.file, "product");
        if (!isSuccess) return res.status(400).send(resWrapper("Failed to upload image", 400, null, cloudError));

        await product.update({ ...value, imageUrl: data })
    } else {
        await product.update({ ...value })
    }

    return res.status(200).send(resWrapper("Product Updated", 200, product));
}


module.exports = {
    getAProduct,
    getAllproducts,
    deleteAProduct,
    createAProduct,
    updateAProduct
};