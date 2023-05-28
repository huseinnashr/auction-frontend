import { Expose } from "class-transformer"

export class PaginationResponse {
  @Expose()
  currId: number = 0

  @Expose()
  nextId: number = 0
}