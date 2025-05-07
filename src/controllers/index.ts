import { checkPass } from './../utils/auth';
import { Request, Response } from 'express';
import slug from 'slug';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { generateJWT } from '../utils/jwt';
import formidable from 'formidable';
import cloudinary from '../config/cloudinary';
import { v4 as uuid } from 'uuid';

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

export const getUser = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    const handle = slug(req.body.handle, '');
    const handleExists = await User.findOne({ handle });

    if (handleExists && handleExists.email !== req.user.email) {
      const error = new Error('El usuario ya existe');
      res.status(409).json({ error: error.message });
      return;
    }

    req.user.handle = handle;
    req.user.description = description;
    await req.user.save();
    res.send('Perfil actualizado correctamente');
    return;
  } catch (e) {
    const error = new Error('Error');
    res.status(500).json({ error: error.message });
    return;
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false, keepExtensions: true });
  try {
    form.parse(req, (error, fields, files) => {
      if (error) {
        console.error('error al parsear', error);
        res.status(500).json({ error: 'Error al subir el archivo' });
        return;
      }
      cloudinary.uploader.upload(
        files.file[0].filepath,
        {
          public_id: uuid(),
        },
        async function (err, result) {
          if (err) {
            const error = new Error('Hubo un error al subir la imagen');
            res.status(500).json({ error: error.message });
            return;
          }
          if (result) {
            req.user.image = result.secure_url;
            await req.user.save();

            res.json({ image: result.secure_url });
          }
        },
      );
    });
  } catch (e) {
    const error = new Error('Error al subir archivo');
    res.status(500).json({ error: error.message });
    return;
  }
};
