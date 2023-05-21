import { Expose, Type } from "class-transformer";
import type { Nullable } from "../pkg/safecatch/safecatch.type";
import { PaginationResponse } from "./pagination.entity";

export class CreateItemResponse {
  @Expose()
  itemId: number = 0
}

export class ItemEntity {
  @Expose()
  id: number = 0;

  @Expose()
  name: string = "";

  @Expose()
  startPrice: number = 0;

  @Expose()
  timeWindow: number = 0;

  @Expose()
  startedAt: Date = new Date(0);

  @Expose()
  status: ItemStatus = ItemStatus.DRAFT;

  @Expose()
  createdBy: number = 0;

  @Expose()
  bidCount: number = 0;

  @Expose()
  bidAmount: number = 0;

  @Expose()
  @Type(() => BidWinner)
  winner: Nullable<BidWinner> = null;
}

export enum ItemStatus {
  DRAFT = "draft",
  ONGOING = "ongoing",
  FINISHED = "finished"
}

export class BidWinner {
  @Expose()
  name: string = "";

  @Expose()
  amount: number = 0;
}

export class GetAllItemResponse {
  @Expose()
  @Type(() => ItemEntity)
  items: ItemEntity[] = []

  @Expose()
  @Type(() => PaginationResponse)
  pagination: PaginationResponse = new PaginationResponse()
}

export class GetItemResponse {
  @Expose()
  @Type(() => ItemEntity)
  item: ItemEntity = new ItemEntity()
}

export class PublishItemResponse {
  @Expose()
  message: string = ""
}