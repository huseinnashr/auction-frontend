import { Expose, Type } from "class-transformer";
import { PaginationResponse } from "./pagination.entity";
import { ItemStatus } from "./item.entity";

export class BidEntity {
  @Expose()
  id: number = 0;

  @Expose()
  itemId: number = 0;

  @Expose()
  userId: number = 0;

  @Expose()
  @Type(() => Date)
  createdAt: Date = new Date(0);

  @Expose()
  amount: number = 0;

  @Expose()
  isActive: boolean = false;

  @Expose()
  isReturned: boolean = false;

  @Expose()
  isWinner: boolean = false;

  @Expose()
  isPaid: boolean = false;

  @Expose()
  @Type(() => BidItem)
  item: BidItem = new BidItem()

  @Expose()
  @Type(() => Bidder)
  bidder: Bidder = new Bidder()
}

class BidItem {
  @Expose()
  name: string = ""

  @Expose()
  status: ItemStatus = ItemStatus.DRAFT;
}

class Bidder {
  @Expose()
  username: string = ""
}

export class BidResponse {
  @Expose()
  message: string = ""
}

export class GetAllBidResponse {
  @Expose()
  @Type(() => BidEntity)
  bids: BidEntity[] = []

  @Expose()
  @Type(() => PaginationResponse)
  pagination: PaginationResponse = new PaginationResponse()
}