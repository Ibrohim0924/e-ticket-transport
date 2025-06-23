import { resError } from "../helper/error-res.js"

export const RolesGuard = (includeRoles = []) => {
   return (req, res, next) => {
      if(!includeRoles.includes(req.user?.role)){
            return resError(res, 'Forbidden user', 403)
      }
      next()
   }
}