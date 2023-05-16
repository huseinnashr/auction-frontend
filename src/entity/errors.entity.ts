import { AppError, TracableError } from "../pkg/apperror/apperror.pkg"

export class UnexpectedError extends TracableError {
  constructor(parentMessage: string, parentCause: TracableError) {
    const parent = new AppError(parentMessage, parentCause)

    const id = Math.random().toString(36).slice(-5)
    const message = "Something went wrong #" + id

    super(message, parent)
  }
}

export class MessageError {
  message: string = ""
}

export class FieldError {
  message: string = ""
}