import { DynamicModule, Module } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import { DBData } from "./in-memory-db.entity";

export const IN_MEMORY_DB = Symbol('IN_MEMORY_DB');

@Module({})
export class InMemoryDbModule {
  static forRoot(): DynamicModule {
    return {
      module: InMemoryDbModule,
      providers: [
        {
          provide: IN_MEMORY_DB,
          useFactory: (): DBData => {
            const filePath = path.join(__dirname, './data/fake-users.json');

            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data) as DBData;
          },
        },
      ],
      exports: [IN_MEMORY_DB],
    };
  }
}
