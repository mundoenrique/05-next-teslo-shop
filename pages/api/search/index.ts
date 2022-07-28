import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export default function handlre(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(400).json({ message: 'Debe especificar el qury de búsqueda' });
}
