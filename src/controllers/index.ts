import { Request, Response } from 'express';
import slug from 'slug';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { validationResult } from 'express-validator';

export const createAccount = async (req: Request, res: Response) => {
  //Manejar error de validacion
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password, handle } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    const error = new Error('El usuario con ese email ya existe');
    res.status(409).json({ error: error.message });
    return;
  }

  const handleUser = slug(handle);
  const handleExists = await User.findOne({ handleUser });

  if (handleExists) {
    const error = new Error('El usuario ya existe');
    res.status(409).json({ error: error.message });
    return;
  }

  const user = new User(req.body);
  user.password = await hashPassword(password);
  user.handle = handleUser;

  await user.save();
  //   res.status(201).json(user);
  res.send('Usuario creado correctamente');
};
