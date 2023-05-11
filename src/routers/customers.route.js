import { Router } from 'express';
import { getCustomersController,getCustomersByIDController , createCustomersController, updateCustomersByIDController} from '../controllers/customers.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { customerSchema } from '../schemas/customerSchema.js';

const customerRouter = Router()

customerRouter.get('/customers', getCustomersController)
customerRouter.get('/customers/:id', getCustomersByIDController)
customerRouter.post('/customers', validateSchema(customerSchema), createCustomersController)
customerRouter.put('/customers/:id', updateCustomersByIDController)

export { customerRouter };