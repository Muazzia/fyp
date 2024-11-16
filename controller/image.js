const Scan_Data = require("../models/scan_data");
const User = require("../models/user");
const { resWrapper } = require("../utils");
const { uploadSingleToCloudinary } = require("../utils/cloudinary");

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
  obj = {
    image: data,
    percentage,
    title: modelData.data.class,
    description: "This is test description.",
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
