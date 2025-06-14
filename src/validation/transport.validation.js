import Joi from "joi";

export const createTransportValidator = (data) => {
    const transport = Joi.object({
        transport_type: Joi.string().valid('bus', 'plane').required(),
        transport_class: Joi.string().valid('economy', 'comfort').required(),
        seat: Joi.string().optional()
});

    return transport.validate(data)
}

export const updateTransportValidator = (data) => {
    const transport = Joi.object({
        transport_type: Joi.string().valid('bus', 'plane').optional(),
        transport_class: Joi.string().valid('economy', 'comfort').optional(),
        seat: Joi.string().min(1).optional()
    })
    return transport.validate(data)
}