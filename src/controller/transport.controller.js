import Transport from "../models/transport.model.js";
import { resError } from "../helper/error-res.js";
import { resSuccess } from "../helper/success-res.js";
import { createTransportValidator, updateTransportValidator } from "../validation/transport.validation.js";
import { isValidObjectId } from "mongoose";

export class TransportController {
    async createTransport(req, res) {
        try {
            const { value, error } = createTransportValidator(req.body);
            if (error) {
                return resError(res, error, 422);
            }
            
            const transport = await Transport.create({
                transport_type: value.transport_type,
                transport_class: value.transport_class,
                seat: value.seat
            });

            return resSuccess(res, transport);
        } catch (error) {
            console.log(error)
            return resError(res, error);
        }
    }

    async getAllTransports(_, res){
        try {
            const transport = await Transport.find().populate('tickets')
            return resSuccess(res, transport)
        } catch (error) {
            return resError(res, error)
        }
    }
    
    async getTransportById(req, res){
        try {
            const id = req.params.id
            const transport = await TransportController.findTransportById(res, id)
            return resSuccess(res, transport)
        } catch (error) {
            return resError(res, error)
        }
    }
 
    async updateTransportById(req, res){
        try {
            const id = req.params.id
            const transport = await TransportController.findTransportById(res, id)
            const { value, error} = updateTransportValidator(req.body)
            if(error){
                return resError(res, error, 422)
            }       
            const updateTransport = await Transport.findByIdAndUpdate(id, {
                transport_type: value.transport_type,
                transport_class: value.transport_class,
                seat: value.seat
            }, {new: true})
            return resSuccess(res, updateTransport)
        } catch (error) {
            return resError(res, error)   
        }
    }

    async deleteTransportById(req, res){
        try {
            const id = req.params.id
            await TransportController.findTransportById(res, id)
            await Transport.findByIdAndDelete(id)
            return resSuccess(res, {message: 'Transport deleted successfully'})
        } catch (error) {
            return resError(res, error)
        }
    }

    static async findTransportById(res, id){
        try {
            if(!isValidObjectId(id)){
                return resError(res, 'Invalid ObjectId', 400)
            }
            const transport = await Transport.findById(id).populate('tickets')
            if(!transport){
                return resError(res, 'Transport not found', 404)
            }
            return transport
        } catch (error) {
            return resError(res, error)
        }
    }
}
