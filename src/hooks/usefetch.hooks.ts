import { useState } from "react"
import { HOST } from "../config"
import { AppError } from "../pkg/apperror/apperror.pkg"
import { safeCatchPromise } from "../pkg/safecatch/safecatch.pkg"
import { UnexpectedError } from "../entity/errors.entity"
import { MessageError } from "../entity/errors.entity"
import { FieldError } from "../entity/errors.entity"
import { ClassConstructor, JSONType, unmarshall } from "../pkg/jsonutil/jsonutil.pkg"
import { Nullable } from "../pkg/safecatch/safecatch.type"

type UseFetchResponse<T> = T | UnexpectedError | MessageError | FieldError | null
type HTTPMethod = "GET" | "POST"

export const useFetch = <T>(method: HTTPMethod, endpoint: string, cls: ClassConstructor<T>): [boolean, UseFetchResponse<T>, (req: Nullable<JSONType>) => Promise<void>] => {
  const [response, setResponse] = useState<UseFetchResponse<T>>(null)
  const [isLoading, setIsLoading] = useState(false)

  const _fetchData = async (req: Nullable<JSONType>) => {
    let reqBody: Nullable<string> = null
    if (req != null) {
      const rawReq = await safeCatchPromise(async () => JSON.stringify(req))
      if (rawReq instanceof AppError) {
        return new UnexpectedError("failed to marshall fetch req", rawReq)
      }
      reqBody = rawReq
    }

    const res = await safeCatchPromise(() => fetch(HOST + endpoint, { method, body: reqBody, headers: { 'content-type': 'application/json' } }))
    if (res instanceof AppError) {
      return new UnexpectedError(`failed to fetch ${endpoint}`, res)
    }

    const resBody = await safeCatchPromise(() => res.json())
    if (resBody instanceof AppError) {
      return new UnexpectedError(`failed to parse res body to json`, resBody)
    }

    if (resBody.error != null) {
      const messageErr = unmarshall(resBody.error, MessageError)
      if (messageErr instanceof AppError) {
        return new UnexpectedError(`failed to unmarshall body.error`, messageErr)
      }

      return messageErr
    }

    if (resBody.fieldErrors != null) {
      const fieldErr = unmarshall(resBody.fieldErrors, FieldError)
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
    setIsLoading(true)
    setResponse(await _fetchData(req))
    setIsLoading(false)
  }

  return [isLoading, response, fetchData]
}