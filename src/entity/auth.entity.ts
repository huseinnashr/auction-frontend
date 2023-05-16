import { json } from "../pkg/jsonutil/jsonutil.pkg"

export enum AccountStatus {
  NOT_FOUND = "not_found",
  NOT_VERIFIED = "not_verified",
  VERIFIED = "verified"
}

export class StatusResponse {
  @json({ name: 'status' })
  status: AccountStatus = AccountStatus.NOT_FOUND
}

export class LoginResponse {
  token: string = ""
}
