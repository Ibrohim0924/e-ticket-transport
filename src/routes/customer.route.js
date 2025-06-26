import { Router } from "express";
import { CustomerController } from "../controller/customer.controller.js";
import { RolesGuard } from "../guard/roles.guard.js";
import { AuthGuard } from "../guard/auth.guard.js";

const router = Router()
const controller = new CustomerController()

router 
    .post('/signup', controller.SignUp)
    .post('/signinemail', controller.SignInEmailCustomer)
    .post('/confirm-signin', controller.confirmSignIn)
    .post('/token', controller.newAccessToken)
    .post('/logout', controller.logOut)
    .get('/',AuthGuard, RolesGuard(['admin', 'superadmin']), controller.getAllCustomers)
    .get('/:id',AuthGuard, RolesGuard(['admin', 'superadmin']), controller.getCustomerById)
    .patch('/:id',AuthGuard, RolesGuard(['admin', 'superadmin']), controller.updateCustomerById)
    .delete('/:id',AuthGuard, RolesGuard(['admin', 'superadmin']), controller.deleteCustomerById)

export default router