import { ConfigService } from '../config.service';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class EnvConfigService extends ConfigService {
  constructor(filePath: string) {
    super();
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }
}
