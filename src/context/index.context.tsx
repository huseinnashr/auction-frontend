import React, { createContext } from 'react';
import { AuthContext, IAuthContext } from './auth.context';

interface IContext {
  auth: IAuthContext
}
export const Context = createContext({} as IContext)

export const ContextProvider = (props: React.PropsWithChildren) => {
  const auth = AuthContext()

  return <Context.Provider value={{ auth }}>
    {props.children}
  </Context.Provider>
}