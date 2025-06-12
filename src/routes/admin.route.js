import { Router } from "express";
import { AdminController } from "../controller/admin.controller.js";

const router = Router()
const controller = new AdminController()

router
    .post('/', controller.creatAdmin)
    .get('/', controller.getAllAdmins)
    .get('/:id', controller.getAdminById)
    .patch('/:id', controller.updateAdminById)
    .delete('/:id', controller.deleteAdminById)


export default router