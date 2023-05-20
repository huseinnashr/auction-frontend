import { Expose, Type } from "class-transformer"

export enum AccountStatus {
  NOT_FOUND = "not_found",
  NOT_VERIFIED = "not_verified",
  VERIFIED = "verified"
}

export class StatusResponse {
  @Expose()
  status: AccountStatus = AccountStatus.NOT_FOUND
}

export class LoginResponse {
  @Expose()
  token: string = ""

  @Expose()
  user: LoginUser = new LoginUser()

  @Expose()
  @Type(() => Date)
  expiredAt: Date = new Date(0)
}

class LoginUser {
  @Expose()
  username: string = ""
}
