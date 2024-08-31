const multer = require("multer");
const { resWrapper } = require("../../utils");


const storage = multer.memoryStorage();
const allowedFileTypes = ["jpg", "jpeg", "png", "webp"];


function fileFilter(req, file, cb) {
    const fileExtension = file.originalname.split(".").pop().toLowerCase();
    if (file.mimetype.startsWith("image/") && allowedFileTypes.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error(`File type not supported. Please upload a valid image file. ${allowedFileTypes}`), false);
    }
}

const uploader = multer({ storage: storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })


const uploadImages = function ({ fieldName, isSinlge = false, maxCount = 10, isRequired = true }) {
    let upload;

    if (isSinlge) upload = uploader.single(fieldName);
    else upload = uploader.array(fieldName, maxCount);

    return (req, res, next) => {
        upload(req, res, err => {
            if (err instanceof multer.MulterError) {
                console.log("Multer Error:", err);
                return res.status(400).send(resWrapper("File upload error", 400, null, err.message))
            } else if (err) {
                return res.status(400).send(resWrapper(err.message, 400, null, err.message))
            }

            // if images are not required
            if (!isRequired) return next()


            if (!isSinlge) {
                if (!req.files || req.files.length === 0) {
                    return res.status(400).send(resWrapper(`Missing required parameter ${fieldName}`, 400, null, `Missing required parameter ${fieldName}`))
                }
            } else {
                if (!req.file) {
                    return res.status(400).send(resWrapper(`Missing required parameter ${fieldName}`, 400, null, `Missing required parameter ${fieldName}`))
                }
            }

            next();

        });
    }

}

module.exports = { uploadImages }