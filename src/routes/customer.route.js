import { Router } from "express";
import { CustomerController } from "../controller/customer.controller.js";

const router = Router()
const controller = new CustomerController()

router 
    .post('/', controller.SignUp)

export default router