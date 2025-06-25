import Joi from "joi";

export const createValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().required()
    });
    return admin.validate(data);
}


export const SigninValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().required()
    });
    return admin.validate(data);
}


export const updateValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).optional(),
        password: Joi.string().required(),
        is_active: Joi.boolean().optional()
    });
    return admin.validate(data);
}