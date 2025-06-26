import { Router } from "express";
import { TicketController } from "../controller/ticket.controller.js";
import { RolesGuard } from "../guard/roles.guard.js";
import { AuthGuard } from "../guard/auth.guard.js";

const router = Router()
const controller = new TicketController()

router
    .post('/',AuthGuard, RolesGuard(['admin', 'superadmin']), controller.createTicket)
    .get('/', controller.getAllTickets)
    .get('/:id', controller.getTicketById)
    .patch('/:id',AuthGuard, RolesGuard(['admin', 'superadmin']), controller.updateTicketById)
    .delete('/:id',AuthGuard, RolesGuard(['admin', 'superadmin']), controller.deleteTicketById)

export default router