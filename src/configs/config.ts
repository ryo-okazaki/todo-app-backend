import dotenv from 'dotenv';
dotenv.config();

type ConfigValues = {
  EXPRESS_INTERNAL_SERVER_PORT: number;
  EXPRESS_SERVER_PORT: string;
  FRONT_URL: string;
  SERVER_URL: string;
  JWT_SECRET: string;
  CLOUDFRONT_URL: string;
  S3_BUCKET: string;
  S3_REGION: string;
  LOCAL_S3_ACCESS_KEY: string;
  LOCAL_S3_SECRET_KEY: string;
};

class Config {
  private static instance: Config;
  private readonly _configs: {
    EXPRESS_INTERNAL_SERVER_PORT: number;
    EXPRESS_SERVER_PORT: string;
    FRONT_URL: string;
    SERVER_URL: string;
    JWT_SECRET: string;
    CLOUDFRONT_URL: string;
    S3_BUCKET: string;
    S3_REGION: string;
    LOCAL_S3_ACCESS_KEY: string;
    LOCAL_S3_SECRET_KEY: string;
    LOCAL_S3_ENDPOINT: string;
  };

  constructor() {
    // singleton pattern
    if (Config.instance) {
      return Config.instance;
    }

    this._configs = {
      // 環境変数
      EXPRESS_INTERNAL_SERVER_PORT: 3000,
      EXPRESS_SERVER_PORT: process.env.EXPRESS_SERVER_PORT,
      FRONT_URL: process.env.FRONT_URL,
      SERVER_URL: process.env.SERVER_URL,
      JWT_SECRET: process.env.JWT_SECRET,
      CLOUDFRONT_URL: process.env.CLOUDFRONT_URL,
      S3_BUCKET: process.env.S3_BUCKET,
      S3_REGION: process.env.S3_REGION,
      LOCAL_S3_ACCESS_KEY: process.env.LOCAL_S3_ACCESS_KEY,
      LOCAL_S3_SECRET_KEY: process.env.LOCAL_S3_SECRET_KEY,
      LOCAL_S3_ENDPOINT: process.env.LOCAL_S3_ENDPOINT,
    };

    Config.instance = this;
  }

  get<K extends keyof ConfigValues>(key: K): string {
    if (!(key in this._configs)) {
      throw new Error(`設定キー "${key}" が見つかりません`);
    }
    return this._configs[key];
  }
}

export default new Config();
