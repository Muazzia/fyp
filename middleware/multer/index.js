const multer = require("multer");
const { resWrapper } = require("../../utils");

const storage = multer.memoryStorage();
const allowedFileTypes = ["jpg", "jpeg", "png", "webp"];

function fileFilter(req, file, cb) {
  const fileExtension = file.originalname.split(".").pop().toLowerCase();
  if (
    file.mimetype.startsWith("image/") &&
    allowedFileTypes.includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type not supported. Please upload a valid image file. ${allowedFileTypes}`
      ),
      false
    );
  }
}

const uploader = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadImages = function ({
  fieldName,
  isSinlge = false,
  maxCount = 10,
  isRequired = true,
}) {
  let upload;

  if (isSinlge) upload = uploader.single(fieldName);
  else upload = uploader.array(fieldName, maxCount);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log("Multer Error:", err);
        return res
          .status(400)
          .send(resWrapper("File upload error", 400, null, err.message));
      } else if (err) {
        return res
          .status(400)
          .send(resWrapper(err.message, 400, null, err.message));
      }

      // if images are not required
      if (!isRequired) return next();

      if (!isSinlge) {
        if (!req.files || req.files.length === 0) {
          return res
            .status(400)
            .send(
              resWrapper(
                `Missing required parameter ${fieldName}`,
                400,
                null,
                `Missing required parameter ${fieldName}`
              )
            );
        }
      } else {
        if (!req.file) {
          return res
            .status(400)
            .send(
              resWrapper(
                `Missing required parameter ${fieldName}`,
                400,
                null,
                `Missing required parameter ${fieldName}`
              )
            );
        }
      }

      next();
    });
  };
};
const uploadMultipleFields = function ({
  fields = [], // Array of field configurations [{ name: 'fieldName', maxCount: 1 }]
  isRequired = true,
}) {
  const upload = uploader.fields(fields);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err);
        return res
          .status(400)
          .send(resWrapper("File upload error", 400, null, err.message));
      } else if (err) {
        return res
          .status(400)
          .send(resWrapper(err.message, 400, null, err.message));
      }

      // If images are not required
      if (!isRequired) return next();

      // Validate each field to ensure files are uploaded
      for (const field of fields) {
        const { name } = field;

        if (!req.files || !req.files[name] || req.files[name].length === 0) {
          return res
            .status(400)
            .send(
              resWrapper(
                `Missing required parameter ${name}`,
                400,
                null,
                `Missing required parameter ${name}`
              )
            );
        }
      }

      next();
    });
  };
};

module.exports = { uploadImages, uploadMultipleFields };
