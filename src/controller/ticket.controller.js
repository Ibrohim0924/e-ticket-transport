import Ticket from '../models/ticket.model.js'
import { resError } from '../helper/error-res.js'
import { resSuccess } from '../helper/success-res.js'
import { createTicketValidator, updateeTicketValidator } from '../validation/ticket.validation.js'
import { isValidObjectId } from 'mongoose'

export class TicketController {
    async createTicket(req, res){
        try {
            const {value, error} = createTicketValidator(req.body)
            if(error){
                return resError(res, error, 422)
            }
            const ticket = await Ticket.create({
                transportId: value.transportId,
                from: value.from,
                to: value.to,
                price: value.price,
                departureDate: value.departureDate,
                arrivalDate: value.arrivalDate
            })
            return resSuccess(res, ticket)
        } catch (error) {
            return resError(res, error)
        }
    }

    async getAllTickets(_, res){
        try {
            const ticket = await Ticket.find()
            return resSuccess(res, ticket)
        } catch (error) {
            return resError(res, error)
        }
    }
    
    async getTicketById(req, res){
        try {
            const ticket = await TicketController.findTicketById(res, req.params.id)
            return resSuccess(res, ticket)
        } catch (error) {
            return resError(res, error)
        }
    }
    
    async updateTicketById(req, res){
        try {
            const id = req.params.id
            const { value, error} = updateeTicketValidator(req.body)
            if(error){
                return resError(res, error, 422)
            }    
            const ticket = await Ticket.findByIdAndUpdate(id, {
                transportId: value.transportId,
                from: value.from,
                to: value.to,
                price: value.price,
                departureDate: value.departureDate,
                arrivalDate: value.arrivalDate
            }, {new: true})
            return resSuccess(res, ticket)
        } catch (error) {
            return resError(res, error)
        }
    }
    
    async deleteTicketById(req, res){
        try {
            const id = req.params.id
            await TicketController.findTicketById(res, id)
            await Ticket.findByIdAndDelete(id)
            return resSuccess(res, 'Ticket deleted successfully')
        } catch (error) {
            return resError(res, error)
        }
    }

    static async findTicketById(res, id){
        try {
            if(!isValidObjectId(id)){
                return resError(res, 'Invalid ObjectId', 400)
            }
            const ticket = await Ticket.findById(id)
            if(!ticket){
                return resError(res, 'Ticket not found', 404)
            }
            return ticket
        } catch (error) {
            return resError(res, error)
        }
    }
}