import { Expose } from "class-transformer"
import { AppError, TracableError } from "../pkg/apperror/apperror.pkg"
import { Nullable } from "../pkg/safecatch/safecatch.type"

export class UnexpectedError extends TracableError {
  constructor(parentMessage: string, parentCause: TracableError) {
    const parent = new AppError(parentMessage, parentCause)

    const id = Math.random().toString(36).slice(-5)
    const message = "Something went wrong #" + id

    super(message, parent)
  }

  toMessageError(): ViewMessageError {
    const messageErr = new ViewMessageError()
    messageErr.message = this.message

    return messageErr
  }
}

export class ViewMessageError {
  @Expose()
  message: string = ""
}

export class ViewFieldError {
  @Expose()
  fieldErrors: { [key: string]: string } = {}
}

export class ViewUnauthorized {
  constructor(public message: string) { }
}