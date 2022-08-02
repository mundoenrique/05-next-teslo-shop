import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

import { db } from '../../../database';
import { User } from '../../../models';
import { jwt, validations } from '../../../utils';

type Data =
  | { message: string }
  | {
      token: string;
      user: {
        email: string;
        name: string;
        role: string;
      };
    };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return RegisterUser(req, res);

    default:
      res.status(400).json({
        message: 'Bad request',
      });
  }
}

const RegisterUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = '', password = '', name = '' } = req.body;

  if (password.length < 6) {
    return res.status(400).json({
      message: 'La contraeña debe ser de 6 caracteres o más',
    });
  }

  if (name.length < 2) {
    return res.status(400).json({
      message: 'EL nombre debe ser de dos caracteres ó mas',
    });
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({
      message: 'El correo no tiene formato de correo',
    });
  }

  await db.connect();
  const user = await User.findOne({ email });

  if (user) {
    await db.disconnect();
    return res.status(400).json({ message: 'No se puede usar ese correo' });
  }

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password),
    role: 'client',
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(500).json({
      message: 'Revisar logs del servidor',
    });
  }

  const { _id, role } = newUser;

  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token, //jwt
    user: {
      email,
      role,
      name,
    },
  });
};
