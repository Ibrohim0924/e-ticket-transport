import Customer from "../models/customer.model.js";
import { resError } from "../helper/error-res.js";
import { resSuccess } from "../helper/success-res.js";
import { createCustomerValidator, updateCustomerValidator } from "../validation/customer.validation.js";
import { Token } from "../utils/token-service.js";
import config from "../config/index.js";
const token = new Token()

export class CustomerController {
    async SignUp(req, res){
        try {
            const {value, error} = createCustomerValidator(req.body)
            if(error){
                return resError(res, error, 422)
            }
            const existsNumber = await Customer.findOne({phoneNumber: value.phoneNumber})
            if(existsNumber){
                return resError(res, 'This phone number already registred', 409)
            }
            const existsEmail = await Customer.findOne({ email: value.email })
            if(existsEmail){
                return resError(res, 'This email already taken', 409)
            }
            const customer = await Customer.create(value)
            const payload = { id: customer._id}
            const accessToken = await token.generateAccessToken(payload)
            const refreshToken = await token.generateRefreshToken(payload)
            res.cookie('refreshTokenCustomer', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return resSuccess(res, {
                data: customer,
                token: accessToken
            }, 201);
        } catch (error) {
            return resError(res, error)
        }
    }
}
