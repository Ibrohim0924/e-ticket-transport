import { Schema, model } from 'mongoose'

const TransportSchema = new Schema({
    transport_type: {type: String, enum: ['bus', 'plane'], required: true },
    transport_class: { type:String, enum: ['economy', 'comfort'], required: true }, 
    seat: {type: String}
}, { 
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

TransportSchema.virtual('tickets', {
    ref: 'Ticket',
    localField: '_id',
    foreignField: 'transportId'
})

const Transport = model('Transport', TransportSchema)
export default Transport;