import { ConfigService } from '../config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JsonConfigService extends ConfigService {
  constructor() {
    super();
    this.envConfig = require(`${process.cwd()}/config-vars.json`);
  }
}
