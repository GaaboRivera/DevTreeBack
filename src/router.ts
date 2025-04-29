import { Router } from 'express';
import { createAccount } from './controllers';
import { body } from 'express-validator';

const router = Router();

/** Autenticacion y registro */
router.post(
	'/auth/register',
	body('handle').notEmpty().withMessage('El handle no puede ir vacio'),
	body('nombre').notEmpty().withMessage('El nombre no puede ir vacio'),
	body('email').isEmail().withMessage('E-mail no valido'),
	body('password').isLength({ min: 8 }).withMessage('El password es muy corto'),
	createAccount,
);

export default router;
