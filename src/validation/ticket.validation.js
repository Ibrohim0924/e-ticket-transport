import Joi from "joi";

export const createTicketValidator = (data) => {
    const ticket = Joi.object({
        transportId: Joi.string().required(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        price: Joi.string().required(),
        departureDate: Joi.date().required(),
        arrivalDate: Joi.date().required()
    })
    return ticket.validate(data)
}

export const updateeTicketValidator = (data) => {
    const ticket = Joi.object({
        transportId: Joi.string().optional(),
        from: Joi.string().optional(),
        to: Joi.string().optional(),
        price: Joi.string().optional(),
        departureDate: Joi.date().optional(),
        arrivalDate: Joi.date().optional()
    })
    return ticket.validate(data)
}