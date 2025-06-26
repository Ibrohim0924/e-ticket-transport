import { Router } from "express";
import { TransportController } from "../controller/transport.controller.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { RolesGuard } from "../guard/roles.guard.js";

const router = Router()
const controller = new TransportController()

router 
    .post('/',AuthGuard, RolesGuard(['superadmin', 'admin']), controller.createTransport)
    .get('/', controller.getAllTransports)
    .get('/:id', controller.getTransportById)
    .patch('/:id',AuthGuard, RolesGuard(['admin', 'superadmin']), controller.updateTransportById)
    .delete('/:id',AuthGuard, RolesGuard(['admin', 'superadmin']), controller.deleteTransportById)

export default router
