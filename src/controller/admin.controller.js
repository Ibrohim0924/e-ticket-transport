import { resError } from '../helper/error-res.js'
import { resSuccess } from '../helper/success-res.js'
import { updateValidator, createValidator } from '../validation/admin.validation.js'
import { Crypto } from '../utils/encrypt-dcrypt.js'
import Admin  from '../models/admin.model.js'
import { isValidObjectId } from 'mongoose'
import { Token } from '../utils/token-service.js'

const token = new Token()
const crypto = new Crypto()

export class AdminController {
    async createAdmin(req, res){
        try {
            const {value, error} = createValidator(req.body)
            if(error){
                return resError(res, error, 422)
            }
            const existsUsername = await Admin.findOne({ username: value.username})
            if(existsUsername){
                return resError(res, 'Username already taken', 409)
            }
            const hashedPassword = await crypto.encrypt(value.password)
            const admin = await Admin.create({
                ...value,
                hashedPassword
            })
            const payload = { id: admin._id , role: admin.role}
            const accessToken = await token.generateAccessToken(payload)
            const refreshToken = await token.generateRefreshToken(payload)
            res.cookie('refreshTokenAdmin', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return resSuccess(res, {
                data: admin,
                token: accessToken
            }, 201);
            
        } catch (error) {
            return resError(res, error)
        }
    } 

       
    async SignInAdmin(req, res){
        try {
            const {value, error} = createValidator(req.body)
            if(error){
                return resError(res, error)
            }
            const admin = await Admin.findOne({username: value.username})
            if(!admin){
                return resError(res, 'Admin not found', 404)
            }
            const payload = { id: admin._id , role: admin.role}
            const accessToken = await token.generateAccessToken(payload)
            const refreshToken = await token.generateRefreshToken(payload)
            res.cookie('refreshTokenAdmin', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return resSuccess(res, {
                data: admin,
                token: accessToken
            }, 201);
            
        } catch (error) { 
            return resError(res, error)
        }
    }
    
    async newAccessToken(req, res){
            try {
                const refreshToken = req.cookies?.refreshTokenAdmin
                if(!refreshToken){
                    return resError(res, 'Refresh token expired', 400)
                }
                const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY)
                if(!decodedToken){
                    return resError(res, 'Invalid token', 400)
                }
                const admin = await Admin.findOne({_id: decodedToken.id})
                if(!admin){
                    return resError(res, 'Admin not found', 404)
                }
                const payload = { id: admin._id, role: admin.role}
                const accessToken = await token.generateAccessToken(payload)
                return resSuccess(res, {
                    token: accessToken
                })
            } catch (error) {
                return resError(res, error)
            }
        }

    async logOut(req, res){
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin
            if(!refreshToken){
                return resError(res, 'Refresh Token expired', 400)
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY)
            if(!decodedToken){
                return resError(res, 'Invalid token', 400)
            }
            const admin = await Admin.findOne({ _id: decodedToken.id})
            if(!admin){
                return resError(res, 'Admin not found', 404)
            }
            res.clearCookie('refreshTokenAdmin')
            return resSuccess(res, {})
        } catch (error) {
            return resError(res, error)
        }
    }
        

    async getAllAdmins(_, res){
        try {
            const admin = await Admin.find()
            return resSuccess(res, admin)
        } catch (error) {
            return resError(res, error)
        }
    }

    async getAdminById(req, res){
        try {
            const admin = await AdminController.findAdminById(res, req.params.id)
            return resSuccess(res, admin)
        } catch (error) {
            return resError(res, error)
        }
    }

    async updateAdminById(req, res){
        try {
            const id = req.params.id
            const admin = await AdminController.findAdminById(res, id)
            const { value, error} = updateValidator(req.body)
            if(error){
                return resError(res, error, 422)
            }
            let hashedPassword = admin.hashedPassword
            if(value.password){
                hashedPassword = await crypto.encrypt(password)
            }
            const updatedAdmin = await Admin.findByIdAndUpdate(id, {
                ...value,
                hashedPassword
            }, { new: true });
            return resSuccess(res, updatedAdmin)
        } catch (error) {
            return resError(res, error)
        }
    }

    async deleteAdminById(req, res) {
        try {
            const id = req.params.id;
            await AdminController.findAdminById(res, id);
            await Admin.findByIdAndDelete(id);
            return resSuccess(res, { message: 'Admin deleted successfully' });
        } catch (error) {
            return resError(res, error);
        }
    }

    static async findAdminById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return resError(res, 'Invalid object ID', 400);
            }
            const admin = await Admin.findById(id);
            if (!admin) {
                return resError(res, 'Admin not found', 404);
            }
            return admin;
        } catch (error) {
            return resError(res, error);
        }
    }
}