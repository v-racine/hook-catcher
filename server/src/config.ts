class Config {
  private static instance: Config;

  readonly mongoUri: string;
  readonly mongoDbName: string;
  readonly dbHost: string;
  readonly dbPort: number;
  readonly dbName: string;
  readonly dbUser: string;
  readonly dbPassword: string | undefined;
  readonly nodeEnv: string;
  readonly port: number;

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }

  private constructor() {
    this.mongoUri = this.require("MONGO_URI");
    this.mongoDbName = this.require("MONGO_DB_NAME");
    this.dbHost = this.require("DB_HOST");
    this.dbPort = this.requireNumber("DB_PORT");
    this.dbName = this.require("DB_NAME");
    this.dbUser = this.require("DB_USER");
    this.dbPassword = process.env.DB_PASSWORD;
    this.nodeEnv = this.require("NODE_ENV");
    this.port = this.requireNumber("PORT");
  }

  private require(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required config: ${key}`);
    return value;
  }

  private requireNumber(key: string): number {
    const value = this.require(key);
    const parsed = Number(value);
    if (isNaN(parsed))
      throw new Error(
        `Config value for ${key} is not a valid number: "${value}"`,
      );
    return parsed;
  }

  static getInstance(): Config {
    if (!Config.instance) Config.instance = new Config();
    return Config.instance;
  }
}

export default Config;
