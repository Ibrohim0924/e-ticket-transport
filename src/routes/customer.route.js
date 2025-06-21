import { Router } from "express";
import { CustomerController } from "../controller/customer.controller.js";

const router = Router()
const controller = new CustomerController()

router 
    .post('/signup', controller.SignUp)
    .post('/signinemail', controller.SignInEmailCustomer)
    .post('/confirm-signin', controller.confirmSignIn)
    // .post('/signinphone', controller.SignInPhoneCustomer)
    .post('/token', controller.newAccessToken)
    .post('/logout', controller.logOut)

export default router