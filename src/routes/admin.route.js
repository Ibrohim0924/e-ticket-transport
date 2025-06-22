import { Router } from "express";
import { AdminController } from "../controller/admin.controller.js";

export const router = Router()
export const controller = new AdminController()

router
    .post('/', logMid, controller.createAdmin)
    .get('/', controller.getAllAdmins)
    .get('/:id', controller.getAdminById)
    .patch('/:id', controller.updateAdminById)
    .delete('/:id', controller.deleteAdminById);


export default router