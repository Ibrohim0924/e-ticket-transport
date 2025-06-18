import Customer from "../models/customer.model.js";
import { resError } from "../helper/error-res.js";
import { resSuccess } from "../helper/success-res.js";
import { SignInCustomerValidator, updateCustomerValidator, SignUpCustomerValidator, ConfirmSignInCustomerValidator } from "../validation/customer.validation.js";
import { Token } from "../utils/token-service.js";
import config from "../config/index.js";
import { generateOTP } from "../helper/generate-otp.js"; 
import NodeCache from "node-cache";
import { transporter } from "../helper/sendMail.js";
 
const cache = new NodeCache()
const token = new Token()

export class CustomerController {
    async SignUp(req, res){
        try {
            const {value, error} = SignUpCustomerValidator(req.body)
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

    async SignIn(req, res){
        try {
            const { value, error } = SignInCustomerValidator(req.body)
            if(error){
                return resError(res, error, 422)
            }
            const email = value.email
            const customer = await Customer.findOne({email})
            if(!customer){
                return resError(res, 'Customer not found', 404)
            }
            const otp = generateOTP()
            const mailOptions = {
                from: config.MAIL_USER,
                to: email,
                subject: 'E-ticket',
                text: otp
                
            }
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error)
                    return resError(res, 'Error on sending to email', 400)
                }else{
                    console.log(info)
                }
            })
            cache.set(email, otp, 120)
            return resSuccess(res, {
                message: 'OTP sent successfully to email'
            })
        } catch (error) {
            return resError(res, error)
        }
    }
     
    async confirmSignIn(req, res){
        try {
            const {value, error} = ConfirmSignInCustomerValidator(req.body)
            if(error){
                return resError(res, error)
            }
            const customer = await Customer.findOne({email: value.email})
            if(!customer){
                return resError(res, 'Customer not found', 404)
            }
            const cacheOTP = cache.get(value.email)
            if(!cacheOTP || cacheOTP != value.otp){
                return resError(res, 'OTP expired', 400)
            }
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
