import { createContext } from 'react';
import { ICartProduct } from '../../interfaces';

interface ContextProps {
  cart: ICartProduct[];

  // Methods
  addProductTocart: (product: ICartProduct) => void;
}

export const CartContext = createContext({} as ContextProps);
