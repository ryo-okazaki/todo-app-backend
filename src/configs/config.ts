import dotenv from 'dotenv';
dotenv.config();

type ConfigValues = {
  EXPRESS_INTERNAL_SERVER_PORT: number;
  EXPRESS_SERVER_PORT: string;
  JWT_SECRET: string;
  CLOUDFRONT_URL: string;
  S3_BUCKET: string;
  S3_REGION: string;
  LOCAL_S3_ACCESS_KEY: string;
  LOCAL_S3_SECRET_KEY: string;
  LOCAL_S3_ENDPOINT: string;
  KEYCLOAK_BASE_URL: string;
  KEYCLOAK_CLIENT_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_BACKEND_CLIENT_ID: string;
};

class Config {
  private static instance: Config;
  private readonly _configs: {
    EXPRESS_INTERNAL_SERVER_PORT: number;
    EXPRESS_SERVER_PORT: string;
    JWT_SECRET: string;
    CLOUDFRONT_URL: string;
    S3_BUCKET: string;
    S3_REGION: string;
    LOCAL_S3_ACCESS_KEY: string;
    LOCAL_S3_SECRET_KEY: string;
    LOCAL_S3_ENDPOINT: string;
    KEYCLOAK_BASE_URL: string;
    KEYCLOAK_CLIENT_URL: string;
    KEYCLOAK_REALM: string;
    KEYCLOAK_BACKEND_CLIENT_ID: string;
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
      JWT_SECRET: process.env.JWT_SECRET,
      CLOUDFRONT_URL: process.env.CLOUDFRONT_URL,
      S3_BUCKET: process.env.S3_BUCKET,
      S3_REGION: process.env.S3_REGION,
      LOCAL_S3_ACCESS_KEY: process.env.LOCAL_S3_ACCESS_KEY,
      LOCAL_S3_SECRET_KEY: process.env.LOCAL_S3_SECRET_KEY,
      LOCAL_S3_ENDPOINT: process.env.LOCAL_S3_ENDPOINT,
      KEYCLOAK_BASE_URL: process.env.KEYCLOAK_BASE_URL,
      KEYCLOAK_CLIENT_URL: process.env.KEYCLOAK_CLIENT_URL,
      KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
      KEYCLOAK_BACKEND_CLIENT_ID: process.env.KEYCLOAK_BACKEND_CLIENT_ID,
    };

    Config.instance = this;
  }

  get<K extends keyof ConfigValues>(key: K): ConfigValues[K] {
    if (!(key in this._configs)) {
      throw new Error(`設定キー "${key}" が見つかりません`);
    }
    return this._configs[key];
  }
}

export default new Config();
