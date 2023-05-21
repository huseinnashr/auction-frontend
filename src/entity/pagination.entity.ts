import { Expose } from "class-transformer"

export class PaginationResponse {
  @Expose()
  nextId: number = 0
}