import { Schema, model } from "mongoose";

const customerSchema = new Schema({
    email: { type: String, required: true, unique: true},
    phoneNumber: {type: String, required:true, unique: true}
},{
    timestamps: true
})

const Customer = model('Customer', customerSchema)
export default Customer