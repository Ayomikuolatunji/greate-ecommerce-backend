import { Joi } from "express-validation";

export const signupUserValidation = {
  body: Joi.object({
    email: Joi.string().required(),
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
