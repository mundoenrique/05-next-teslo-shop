import { FC, useReducer } from 'react';
import { UiContext, uiReducer } from './';

interface Props {
  children: JSX.Element;
}

export interface UiState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false,
};

export const UiProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toogleSideMenu = () => {
    dispatch({ type: '[UI] - ToggleMenu' });
  };

  return (
    <UiContext.Provider
      value={{
        ...state,

        // Methods
        toogleSideMenu,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
