import {Schema, model} from 'mongoose'

const TicketSchema = new Schema({
    transportId: {type: String, ref: 'Transport', required: true},
    from: {type: String, required: true},
    to: {type: String, required: true},
    price: {type: String, required: true},
    departureDate: {type: Date, required: true},
    arrivalDate: {type: Date, required: true}
}, {
    timestamps: true
})



const Ticket = model('Ticket', TicketSchema)
export default Ticket