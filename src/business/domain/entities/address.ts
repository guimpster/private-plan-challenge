import { BaseEntity } from "../../common/base-entity";

export class Address extends BaseEntity {
  city: string;
  postalCode: string;
  street: string;
  state: string;
}