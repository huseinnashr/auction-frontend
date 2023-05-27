import { Expose } from "class-transformer";

export class BidEntity {

}

export class BidResponse {
  @Expose()
  message: string = ""
}