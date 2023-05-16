import { AppError } from "../apperror/apperror.pkg";
import { PromiseSafe, Safe } from "./safecatch.type";

export function safeCatch<T>(func: () => T): Safe<T> {
  try {
    return func()
  } catch (err) {
    return AppError.toAppError(err)
  }
}

export async function safeCatchPromise<T>(func: () => Promise<T>): PromiseSafe<T> {
  try {
    return await func()
  } catch (err) {
    return AppError.toAppError(err)
  }
}