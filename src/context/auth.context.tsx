import { useEffect, useState } from 'react';
import { Nullable } from '../pkg/safecatch/safecatch.type';
import { LoginResponse } from '../entity/auth.entity';
import { AuthStorageKey, logger } from '../config';
import { unmarshallStr } from '../pkg/jsonutil/jsonutil.pkg';
import { UnexpectedError } from '../entity/errors.entity';
import { AppError } from '../pkg/apperror/apperror.pkg';

export interface IAuthContext {
  data: Nullable<LoginResponse>
  login: (data: LoginResponse) => void
  logout: () => void
}
export const AuthContext = (): IAuthContext => {
  const [data, setData] = useState<Nullable<LoginResponse>>(null);
  useEffect(() => {
    const res = init()
    if (res instanceof UnexpectedError) {
      logger.logError("failed to init auth context", res)
      return
    }

    if (res == null) {
      return
    }

    setData(res)
  }, [])

  useEffect(() => {
    if (!data) {
      return
    }

    setTimeout(() => logout(), +data.expiredAt - +(new Date()))
  }, [data])

  const init = () => {
    const authStr = localStorage.getItem(AuthStorageKey)
    if (authStr == null) {
      return null
    }

    const auth = unmarshallStr(authStr, LoginResponse)
    if (auth instanceof AppError) {
      return new UnexpectedError("failed to unmarshall auth data", auth)
    }

    const now = new Date()
    if (now > auth.expiredAt) {
      return null
    }

    return auth
  }

  const login = (data: LoginResponse) => {
    localStorage.setItem(AuthStorageKey, JSON.stringify(data))
    setData(data)
  }

  const logout = () => {
    localStorage.removeItem(AuthStorageKey)
    setData(null)
  }

  return { data, login, logout };
};

