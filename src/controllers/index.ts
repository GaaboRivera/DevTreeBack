import { checkPass } from './../utils/auth';
import { Request, Response } from 'express';
import slug from 'slug';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { validationResult } from 'express-validator';
import { generateJWT } from '../utils/jwt';

export const createAccount = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const emailExists = await User.findOne({ email });
	if (emailExists) {
		const error = new Error('El usuario con ese email ya existe');
		res.status(409).json({ error: error.message });
		return;
	}

	const handle = slug(req.body.handle, '');
	const handleExists = await User.findOne({ handle });

	if (handleExists) {
		const error = new Error('El usuario ya existe');
		res.status(409).json({ error: error.message });
		return;
	}

	const user = new User(req.body);
	user.password = await hashPassword(req.body.password);
	user.handle = handle;

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

	const token = generateJWT({ id: user.id });

	res.send(token);
};
