import { User } from "src/business/domain/user";

export type DBData = {
  users: User[]; // this is a hack so we don't have to define everything again
};
