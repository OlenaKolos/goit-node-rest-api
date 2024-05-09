// import {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContactId,
// } from "../services/contactsServices.js";

//import { Contact } from "../models/contact";
import { Contact } from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";
import mongoose from "mongoose";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw HttpError(400);
    }
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw HttpError(400);
    }
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw HttpError(400);
    }
    const result = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!result) {
      throw HttpError(404, "Not found");
    }

    // if (!req.body || Object.keys(req.body).length === 0) {
    //   throw HttpError(400, "Body must have at least one field");
    // }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw HttpError(400);
    }
    // const { error } = updateFavoriteSchema.validate(req.body);
    // if (error) {
    //   throw HttpError(400, error.message);
    // }
    // const { favorite } = req.body;

    const result = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
