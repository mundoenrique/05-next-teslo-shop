import bcrypt from 'bcryptjs';

import { User } from '../models';
import { db } from './';

export const checkUserEmailPassword = async (email: string, password: string) => {
  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect();

  if (!user) {
    return null;
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return null;
  }

  const { role, name, _id } = user;

  return {
    _id,
    email: email.toLocaleLowerCase(),
    role,
    name,
  };
};

export const oAuthToDbUser = async (oAuthemail: string, oAuthName: string) => {
  await db.connect();
  const user = await User.findOne({ email: oAuthemail });

  if (user) {
    await db.disconnect();
    const { role, name, email, _id } = user;
    return { _id, email, role, name };
  }

  const newUser = new User({ email: oAuthemail, name: oAuthName, password: '@', role: 'client' });
  await newUser.save();
  await db.disconnect();

  const { _id, name, email, role } = newUser;
  return { _id, name, email, role };
};
