import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';

import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

interface Props {
  children: JSX.Element;
}

export interface CartState {
  cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
};

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);
  useEffect(() => {
    try {
      const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
      dispatch({ type: '[Cart] - LoadCart from cookie | storage', payload: cookieProducts });
    } catch (error) {
      dispatch({ type: '[Cart] - LoadCart from cookie | storage', payload: [] });
    }
  }, []);

  useEffect(() => {
    Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  const addProductTocart = (product: ICartProduct) => {
    const productInCArt = state.cart.some((p) => p._id === product._id);
    if (!productInCArt)
      return dispatch({ type: '[Cart] - update products in cart', payload: [...state.cart, product] });

    const productIncartButDifferetSize = state.cart.some((p) => p._id === product._id && p.size === product.size);
    if (!productIncartButDifferetSize)
      return dispatch({ type: '[Cart] - update products in cart', payload: [...state.cart, product] });

    //Acumular
    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      // Actualizar la cantidad
      p.quantity += product.quantity;

      return p;
    });

    return dispatch({ type: '[Cart] - update products in cart', payload: updatedProducts });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change cart quantity', payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in cart', payload: product });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,

        //Methods
        addProductTocart,
        removeCartProduct,
        updateCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
