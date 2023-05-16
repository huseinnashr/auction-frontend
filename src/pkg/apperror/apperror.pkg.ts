import { Nullable } from "../safecatch/safecatch.type"

export class TracableError {
  constructor(public message: string, public cause: Nullable<TracableError>, public stack?: string) { }
}

export class AppError extends TracableError {
  constructor(message: string, cause: Nullable<AppError> = null, stack?: string) {
    super(message, cause, stack)
  }

  public static toAppError(err: unknown): AppError {
    if (err instanceof Error) {
      return new AppError(err.message, null, err.stack)
    }

    if (typeof err === "string") {
      return new AppError(err)
    }

    return new AppError("unknown error")
  }
}