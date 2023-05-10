import { Router } from 'express';
import { getCustomersController,getCustomersByIDController , createCustomersController, updateCustomersByIDController} from '../controllers/Customers.controller';

const customerRouter = Router()

customerRouter.get('/customers', getCustomersController)
customerRouter.get('/customers/:id', getCustomersByIDController)
customerRouter.post('/customers', createCustomersController)
customerRouter.put('/customers/:id', updateCustomersByIDController)

export { customerRouter };