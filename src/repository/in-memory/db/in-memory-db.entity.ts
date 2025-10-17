import { User } from "src/business/entities/user.entity";

export type DBData = {
  users: User[]; // this is a hack so we don't have to define everything again
};
