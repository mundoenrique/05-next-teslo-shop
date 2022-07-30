import { CartState } from '.';

type CartActionType = { type: '[Cart] - LoadCart from cookie | storage' };

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
  switch (action.type) {
    case '[Cart] - LoadCart from cookie | storage':
      return {
        ...state,
      };

    default:
      return state;
  }
};
