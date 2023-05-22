import { useContext, useEffect, useState } from "react"
import { HOST, logger } from "../config"
import { AppError } from "../pkg/apperror/apperror.pkg"
import { safeCatchPromise } from "../pkg/safecatch/safecatch.pkg"
import { FieldSource, HTTPErrorCode, UnexpectedError } from "../entity/errors.entity"
import { ViewMessageError } from "../entity/errors.entity"
import { ViewFieldError } from "../entity/errors.entity"
import { ClassConstructor, JSONType, unmarshall } from "../pkg/jsonutil/jsonutil.pkg"
import { Nullable } from "../pkg/safecatch/safecatch.type"
import { Map } from "immutable"
import { Context } from "../context/index.context"

type HTTPMethod = "GET" | "POST"
export type FieldError = Map<string, string>
interface UseFetchReturn<T> {
  loading: boolean,
  data: Nullable<T>
  error: Nullable<ViewMessageError>
  fieldError: FieldError
  fetch: (req: Nullable<JSONType>) => Promise<void>
}
interface FetchOption {
  useAuth?: boolean
  noUserField?: boolean
}

export const useFetch = <T>(method: HTTPMethod, endpoint: string, cls: ClassConstructor<T>, options?: FetchOption): UseFetchReturn<T> => {
  const [data, setData] = useState<Nullable<T>>(null)
  const [error, setError] = useState<Nullable<ViewMessageError>>(null)
  const [fieldError, setFieldError] = useState<Map<string, string>>(Map())
  const [loading, setLoading] = useState(false)
  const { auth } = useContext(Context)

  const abortController = new AbortController()

  useEffect(() => {
    return () => abortController.abort()
  }, [])

  const _fetchData = async (req: Nullable<Object>) => {
    let reqBody: Nullable<string> = null
    if (req != null) {
      const rawReq = await safeCatchPromise(async () => JSON.stringify(req))
      if (rawReq instanceof AppError) {
        return new UnexpectedError("failed to marshall fetch req", rawReq)
      }
      reqBody = rawReq
    }

    const headers: JSONType = { 'content-type': 'application/json' }
    if (options?.useAuth) {
      headers["token"] = auth.data?.token
    }

    const res = await safeCatchPromise(() => fetch(HOST + endpoint, { method, body: reqBody, headers, signal: abortController.signal }))
    if (res instanceof AppError) {
      return new UnexpectedError(`failed to fetch ${endpoint}`, res)
    }

    const resBody = await safeCatchPromise(() => res.json())
    if (resBody instanceof AppError) {
      return new UnexpectedError(`failed to parse res body to json`, resBody)
    }

    if (resBody.error != null) {
      const messageErr = unmarshall(resBody.error, ViewMessageError)
      if (messageErr instanceof AppError) {
        return new UnexpectedError(`failed to unmarshall body.error`, messageErr)
      }

      return messageErr
    }

    if (resBody.fieldErrors != null) {
      const fieldErr = unmarshall(resBody.fieldErrors, ViewFieldError)
      if (fieldErr instanceof AppError) {
        return new UnexpectedError(`failed to unmarshall res body.fieldErrors`, fieldErr)
      }

      return fieldErr
    }

    const bodyObj = unmarshall(resBody, cls)
    if (bodyObj instanceof AppError) {
      return new UnexpectedError(`failed to unmarshall body`, bodyObj)
    }

    return bodyObj
  }

  const fetchData = async (req: Nullable<JSONType>) => {
    setLoading(true)
    setData(null)
    setError(null)
    setFieldError(Map())

    const res = await _fetchData(req)
    setLoading(false)

    if (res instanceof UnexpectedError) {
      logger.logError("fetch return unexpected error", res)
      return setError(res.toMessageError())
    }

    if (res instanceof ViewMessageError) {
      if (res.code == HTTPErrorCode.UNAUTHENTICATED) {
        auth.logout()
      }

      return setError(res)
    }

    if (res instanceof ViewFieldError) {
      if (res.source == FieldSource.HEADER) {
        const err = res.toUnexpectedError()
        logger.logError("fetch return header field error", err)
        return setError(err.toMessageError())
      }

      if (options?.noUserField) {
        const err = res.toUnexpectedError()
        logger.logError("unexpected field error", err)
        return setError(err.toMessageError())
      }

      return setFieldError(Map(res.data))
    }

    return setData(res)
  }

  return { loading, data, error, fieldError, fetch: fetchData }
}