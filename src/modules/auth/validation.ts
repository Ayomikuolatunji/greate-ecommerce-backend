import { Joi } from "express-validation";

export const signupUserValidation = {
  body: Joi.object({
    email: Joi.string().required(),
    firstName: Joi.string().required(),
    password: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
};

export const signupModeratorsValidation = {
  body: Joi.object({
    userName: Joi.string().required(),
    profilePicture: Joi.string(),
    password: Joi.string().required(),
  }),
};

export const loginValidation = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const emailPasswordOtpValidation = {
  body: Joi.object({
    email: Joi.string().required(),
    otp: Joi.string().required(),
  }),
};

export const emailOtpValidation = {
  body: Joi.object({
    email: Joi.string().required(),
    otp: Joi.string().required(),
  }),
};

export const forgottenPasswordValidation = {
  body: Joi.object({
    password: Joi.string().required(),
  }),
};

export const emailValidation = {
  body: Joi.object({
    email: Joi.string().required(),
  }),
};

export const resetPasswordValidation = {
  body: Joi.object({
    email: Joi.string().required(),
    otp: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const userIdValidation = {
  params: Joi.object({
    userId: Joi.string().uuid().required(),
  }),
};
