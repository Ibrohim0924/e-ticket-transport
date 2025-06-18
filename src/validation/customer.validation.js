import Joi from "joi";

export const SignUpCustomerValidator = (data) => {
    const customer = Joi.object({
        email: Joi.string().required(),
        phoneNumber: Joi.string().regex(/^\+998[-\s]?\(?\d{2}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/).required()
    })
    return customer.validate(data)
}

export const updateCustomerValidator = (data) => {
    const customer = Joi.object({
        email: Joi.string().optional(),
        phoneNumber: Joi.string().regex(/^\+998[-\s]?\(?\d{2}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/).optional()
    })
    return customer.validate(data)
}

export const SignInCustomerValidator = (data) => {
    const customer = Joi.object({
        email: Joi.string().email().required()
    })
    return customer.validate(data)
}

export const ConfirmSignInCustomerValidator = (data) => {
    const customer = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required()
    })
    return customer.validate(data)
}