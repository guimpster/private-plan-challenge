import { Source } from "./source";
import { BaseEntity } from "../common/base-entity";

export class PrivatePlanDeposit extends BaseEntity {
  id: string;
  sourceBankAccountId: string;
  sourceTransactionId: string;
  destinationPrivatePlanAccountId: string;
  destinationTransactionId: string;
  processed: boolean;
  sentToDestination: boolean;
  userCredited: boolean;
  amount: number;
  cancelRequested: boolean;
  canceled: boolean;
  comment: string;
  source: Source;
  release_at: Date;
  created_at: Date;
  updated_at: Date;
}