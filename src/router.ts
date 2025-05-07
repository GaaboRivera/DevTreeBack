import { Router } from 'express';
import {
  createAccount,
  getUser,
  login,
  updateProfile,
  uploadImage,
} from './controllers';
import { body } from 'express-validator';
import { handleInputErrors } from './middlewares/validation';
import { authenticate } from './middlewares/auth';

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

router.get('/user', authenticate, getUser);

router.patch(
  '/user',
  body('handle').notEmpty().withMessage('El handle no puede ir vacio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción no puede ir vacia'),
  handleInputErrors,
  authenticate,
  updateProfile,
);

router.post('/user/image', authenticate, uploadImage);

export default router;
