import { resError } from "../helper/error-res.js"

export const SelfGuard = (req, res, next) => {
    if(req.user?.role === 'superadmin' || req.user?.id == req.params?.id ){
        return next()
    }else{
        return resError(res, 'Forbidden user', 403)
    }
}