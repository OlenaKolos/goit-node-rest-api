import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import Jimp from "jimp";
import gravatar from "gravatar";
import path from "node:path";
import { fileURLToPath } from "url";
import fs from "node:fs/promises";

import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";

const { SECRET_KEY } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarsDir = path.join(__dirname, "..", "public", "avatars");

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(HttpError(409, "Email in use"));
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });
    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return next(HttpError(404, "User not found"));
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Missing required field email" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(HttpError(404, "Email not found"));
    }
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`,
    };
    await sendEmail(verifyEmail);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(HttpError(401, "Not authorized"));
  }

  try {
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return next(HttpError(401, "Not authorized"));
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  const { email } = req.user;
  if (!email) {
    return next(HttpError(401, "Not authorized"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    res.json({
      email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;
  const { _id: userId } = req.user;
  const validSubscriptions = ["starter", "pro", "business"];
  if (!validSubscriptions.includes(subscription)) {
    next(HttpError(400, "Invalid subscription type"));
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { subscription },
      { new: true }
    );
    if (!updatedUser) {
      throw HttpError(404, "Not authorized");
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(HttpError(400, "No file uploaded"));
    }

    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }

    const { _id } = req.user;
    const user = await User.findById(_id);
    const { path: tempUpload, originalname } = req.file;
    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, fileName);

    await fs.rename(tempUpload, resultUpload);
    const image = await Jimp.read(resultUpload);
    await image.resize(250, 250).writeAsync(resultUpload);

    //const avatarURL = path.join(fileName);
    const avatarURL = path.join("avatars", fileName);

    await User.findByIdAndUpdate(_id, { avatarURL });
    res.status(200).json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
