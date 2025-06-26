import Customer from "../models/customer.model.js";
import { resError } from "../helper/error-res.js";
import { resSuccess } from "../helper/success-res.js";
import { SignInEmailCustomerValidator, updateCustomerValidator,SignInNumberCustomerValidator, SignUpCustomerValidator, ConfirmSignInCustomerValidator } from "../validation/customer.validation.js";
import { Token } from "../utils/token-service.js";
import config from "../config/index.js";
import { isValidObjectId } from "mongoose";
import { generateOTP } from "../helper/generate-otp.js"; 
import NodeCache from "node-cache";
import { transporter } from "../helper/sendMail.js"
 
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

    async SignInEmailCustomer(req, res){
        try {
            const { value, error } = SignInEmailCustomerValidator(req.body)
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
    
    async newAccessToken(req, res){
        try {
            const refreshToken = req.cookies?.refreshTokenCustomer
            if(!refreshToken){
                return resError(res, 'Refresh token expired', 400)
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY)
            if(!decodedToken){
                return resError(res, 'Invalid token', 400)
            }
            const customer = await Customer.findOne({_id: decodedToken.id})
            if(!customer){
                return resError(res, 'Customer not found', 404)
            }
            const payload = { id: customer._id}
            const accessToken = await token.generateAccessToken(payload)
            return resSuccess(res, {
                token: accessToken
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

    async getAllCustomers(_, res){
        try {
            const customer = await Customer.find()
            return resSuccess(res, customer)
        } catch (error) {
            return resError(res, error)
        }
    }
    
    async getCustomerById(req, res){
        try {
            const customer = await CustomerController.findCustomerById(res, req.params.id)
            return resSuccess(res, customer)
        } catch (error) {
            return resError(res, error)
        }
    }
    
    async updateCustomerById(req, res){
        try {
            const id = req.params.id
            const { value, error} = updateCustomerValidator(req.body)
            if(error){
                return resError(res, error, 422)
            }    
            const customer = await Customer.findByIdAndUpdate(id, {
                ...value
            }, {new: true})
            return resSuccess(res, customer)
        } catch (error) {
            return resError(res, error)
        }
    }
    
    async deleteCustomerById(req, res){
        try {
            const id = req.params.id
            await CustomerController.findCustomerById(res, id)
            await Customer.findByIdAndDelete(id)
            return resSuccess(res, 'Customer deleted successfully')
        } catch (error) {
            return resError(res, error)
        }
    }
    
    async logOut(req, res){
        try {
            const refreshToken = req.cookies?.refreshTokenCustomer
            if(!refreshToken){
                return resError(res, 'Refresh Token expired', 400)
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY)
            if(!decodedToken){
                return resError(res, 'Invalid token', 400)
            }
            const customer = await Customer.findOne({ _id: decodedToken.id})
            if(!customer){
                return resError(res, 'Customer not found', 404)
            }
            res.clearCookie('refreshTokenCustomer')
            return resSuccess(res, {})
        } catch (error) {
            return resError(res, error)
        }
    }
    
    
    static async findCustomerById(res, id){
        try {
            if(!isValidObjectId(id)){
                return resError(res, 'Invalid ObjectId', 400)
            }
            const customer = await Customer.findById(id)
            if(!customer){
                return resError(res, 'Customer not found', 404)
            }
            return customer
            } catch (error) {
            return resError(res, error)
        }
    }
}
