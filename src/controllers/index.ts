import { checkPass } from './../utils/auth';
import { Request, Response } from 'express';
import slug from 'slug';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { validationResult } from 'express-validator';

export const createAccount = async (req: Request, res: Response) => {
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

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		const error = new Error('El usuario no existe');
		res.status(404).json({ error: error.message });
		return;
	}

	//comprobar password
	const isPassCorrect = await checkPass(password, user.password);

	if (!isPassCorrect) {
		const error = new Error('Password incorrecto');
		res.status(401).json({ error: error.message });
		return;
	}
	res.send('autenticado');
};
