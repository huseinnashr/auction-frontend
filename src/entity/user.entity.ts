import { Expose } from "class-transformer";

export class GetBalanceResponse {
  @Expose()
  balance: number = 0
}

export class DepositResponse {
  @Expose()
  message: string = ""
}