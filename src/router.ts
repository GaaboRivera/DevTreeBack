import { Router } from 'express';
import { createAccount, login } from './controllers';
import { body } from 'express-validator';
import { handleInputErrors } from './middlewares/validation';

const router = Router();

/** Autenticacion y registro */
router.post(
	'/auth/register',
	body('handle').notEmpty().withMessage('El handle no puede ir vacio'),
	body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
	body('email').isEmail().withMessage('E-mail no valido'),
	body('password').notEmpty().withMessage('El password es obligatorio'),
	handleInputErrors,
	createAccount,
);

router.post(
	'/auth/login',
	body('email').isEmail().withMessage('E-mail no valido'),
	body('password').notEmpty().withMessage('El password es obligatorio'),
	handleInputErrors,
	login,
);

export default router;
