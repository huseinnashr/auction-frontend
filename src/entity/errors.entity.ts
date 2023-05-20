import { Expose } from "class-transformer"
import { AppError, TracableError } from "../pkg/apperror/apperror.pkg"
import { Nullable } from "../pkg/safecatch/safecatch.type"

export class UnexpectedError extends TracableError {
  constructor(parentMessage: string, parentCause: Nullable<TracableError>) {
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

export enum HTTPErrorCode {
  UNAUTHENTICATED = "unauthorized",
  BAD_REQUEST = "bad_request",
  SERVER_ERROR = "server_error"
}

export class ViewMessageError {
  @Expose()
  code: HTTPErrorCode = HTTPErrorCode.BAD_REQUEST

  @Expose()
  message: string = ""
}

export enum FieldSource {
  HEADER = "header",
  BODY = "body"
}
export class ViewFieldError {
  @Expose()
  source: FieldSource = FieldSource.HEADER

  @Expose()
  data: { [key: string]: string } = {}

  toUnexpectedError(): UnexpectedError {
    return new UnexpectedError(JSON.stringify(this.data), null)
  }
}

export class ViewUnauthorized {
  constructor(public message: string) { }
}