export abstract class ConfigService {
  protected envConfig: { [key: string]: string };

  get(key: string): string {
    return this.envConfig[key];
  }
}
