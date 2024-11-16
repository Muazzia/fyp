const Scan_Data = require("../models/scan_data");
const User = require("../models/user");
const { resWrapper } = require("../utils");
const { uploadSingleToCloudinary } = require("../utils/cloudinary");

const cancerLabels = {
  akeic: {
    name: "AKEIC",
    description:
      "A rare cancer associated with the accumulation of abnormal cells in various parts of the body. Further details on this specific type of cancer may need additional clarification.",
  },
  bcc: {
    name: "BASAL CELL CARCINOMA (BCC)",
    description:
      "Basal Cell Carcinoma (BCC) is the most common form of skin cancer, often caused by prolonged sun exposure. It usually grows slowly and rarely spreads.",
  },
  bkl: {
    name: "BENIGN KERATOSIS (BKL)",
    description:
      "A term likely referring to 'benign keratosis,' a non-cancerous growth on the skin that is often mistaken for early-stage skin cancer but does not spread.",
  },
  df: {
    name: "DESMOPLASTIC FIBROMA (DF)",
    description:
      "Desmoplastic Fibroma (DF) is a rare benign tumor typically found in the bone. It consists of collagen-producing cells and is often treated with surgery.",
  },
  mel: {
    name: "MELANOMA",
    description:
      "Melanoma is a type of skin cancer that develops from pigment-producing cells called melanocytes. It is more aggressive than other skin cancers and can spread to other parts of the body.",
  },
  "non-infected": {
    name: "NON-INFECTED",
    description: "No Cancer Found",
  },
  nv: {
    name: "NEVUS (NV)",
    description:
      "Nevus (plural: nevi) is a medical term for a mole or birthmark on the skin, often a benign growth. In some cases, nevi can develop into melanoma, so monitoring changes is important.",
  },
  vasc: {
    name: "VASCULAR CANCER (VASC)",
    description:
      "Vascular cancers involve abnormal growths in the blood vessels or lymphatic system. One example is Angiosarcoma, a rare and aggressive cancer that originates in the blood vessels.",
  },
};

const uploadScanImage = async (req, res) => {
  const userId = req.userId;

  const {
    isSuccess,
    data,
    error: cloudError,
  } = await uploadSingleToCloudinary(req.file, "scan_data");
  if (!isSuccess)
    return res
      .status(400)
      .send(resWrapper("Failed to upload image", 400, null, cloudError));

  // Now comes the logic with ai Model. The image will be given to the model
  // and the model will return us the result. which will be description

  const modelUrl = process.env.MODEL_URL;
  const modelResponse = await fetch(modelUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data,
    }),
  });

  if (modelResponse.status !== 200)
    return res
      .status(400)
      .send(
        resWrapper(
          "Failed to get result from model. Please try again.",
          400,
          null,
          "Model can't predict at the moment"
        )
      );

  const modelData = await modelResponse.json();

  let obj = {};

  let percentage = modelData.data["confidence_score:"];
  percentage = Math.floor(percentage * 100);

  const originalClass = modelData.data.class.split("/")[0].trim().toLowerCase();
  const cancerType = cancerLabels[originalClass];

  obj = {
    image: data,
    percentage,
    title: cancerType.name,
    description: cancerType.description,
    userId,
  };

  // if (temp) {
  //     const percentage = Math.floor(Math.random() * 100) + 1
  //     obj = {
  //         image: data,
  //         percentage,
  //         title: "Benign",
  //         description: "This is test description.",
  //         userId
  //     }
  // } else {
  //     obj = {
  //         image: data,
  //         percentage: null,
  //         title: null,
  //         description: "No Cancer Found.",
  //         userId
  //     }
  // }

  const scan_data = await Scan_Data.create({ ...obj });

  const tempData = await Scan_Data.findByPk(scan_data.id, {
    include: [
      {
        model: User,
        attributes: ["email", "firstName", "lastName", "profilePic"],
        as: "user",
      },
    ],
  });

  return res.status(201).send(resWrapper("Scan Result", 201, tempData));
};

// const createUser = async (req, res) => {
//     const { error, value: { firstName, lastName, email, password } } = validateCreateUser(req.body)
//     if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

//     const oldUser = await User.findOne({
//         where: {
//             email
//         }
//     });
//     if (oldUser) return res.status(400).send(resWrapper("User With Email ALready Exist", 400, null, "Email With User Already Exist"));

//     const { isSuccess, data, error: cloudError } = await uploadSingleToCloudinary(req.file, "user")
//     if (!isSuccess) return res.status(400).send(resWrapper("Failed to upload image", 400, null, cloudError));

//     const hashedPassword = await bcrypt.hash(password, 10);
//     if (!hashedPassword) return res.status(400).send(resWrapper("Error While Saving. Trying Again", 400, null, "Please Try Again Later"))

//     const user = await User.create({ firstName, lastName, email, password: hashedPassword, profilePic: data });

//     const temp = await User.findByPk(user.id, {
//         ...includeObj
//     });

//     return res.status(201).send(resWrapper("User Created", 201, temp))
// }

module.exports = {
  uploadScanImage,
};
