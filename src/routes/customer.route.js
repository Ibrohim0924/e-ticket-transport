import { Router } from "express";
import { CustomerController } from "../controller/customer.controller.js";

const router = Router()
const controller = new CustomerController()

router 
    .post('/signup', controller.SignUp)
    .post('/signin', controller.SignIn)
    .post('/confirm-signin', controller.confirmSignIn)

export default router