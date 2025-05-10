import {
  S3Client,
  PutObjectCommand,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import path from 'path';
import config from '../configs/config';

/**
 * ファイルアップロードのオプション
 */
interface UploadOptions {
  fileName?: string;
  contentType?: string;
  prefix?: string;
  metadata?: Record<string, string>;
}

/**
 * アップロード結果
 */
interface UploadResult {
  /** 成功したかどうか */
  success: boolean;
  /** ファイルのURL */
  fileUrl: string;
  /** S3内のキー */
  key: string;
  /** バケット名 */
  bucket: string;
  /** ETag */
  etag?: string;
}

/**
 * S3互換ストレージでのファイル操作を処理するクラス
 * 環境変数に基づいて自動的に設定が行われる
 */
export class FileUploader
{
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor() {
    this.bucket = config.get('S3_BUCKET');
    this.region = config.get('S3_REGION');

    const s3Config: S3ClientConfig = {
      region: this.region,
    };

    if (config.get('LOCAL_S3_ACCESS_KEY') && config.get('LOCAL_S3_SECRET_KEY')) {
      s3Config.credentials = {
        accessKeyId: config.get('LOCAL_S3_ACCESS_KEY'),
        secretAccessKey: config.get('LOCAL_S3_SECRET_KEY')
      };
      s3Config.endpoint = config.get('LOCAL_S3_ENDPOINT');
      s3Config.forcePathStyle = true;
    }

    // S3クライアントの初期化
    this.s3Client = new S3Client(s3Config);
  }

  /**
   * ファイルをアップロードする
   * @param fileData - アップロードするファイルデータ
   * @param options - アップロードオプション
   * @returns アップロード結果
   */
  async uploadFile(fileData: Buffer | Uint8Array, options: UploadOptions = {}): Promise<UploadResult> {
    const fileName = options.fileName || 'file';
    const prefix = options.prefix || '';
    const contentType = options.contentType || 'application/octet-stream';

    const uniqueFileName = `${Date.now()}${path.basename(fileName) ? `-${path.basename(fileName)}` : ''}`;
    const fileKey = prefix ? `${prefix}/${uniqueFileName}` : uniqueFileName;

    const params = {
      Bucket: this.bucket,
      Key: fileKey,
      Body: fileData,
      ContentType: contentType,
      Metadata: options.metadata
    };

    try {
      const command = new PutObjectCommand(params);
      const result = await this.s3Client.send(command);

      // URLの生成
      const fileUrl = `${config.get('CLOUDFRONT_URL')}/${fileKey}`;

      return {
        success: true,
        fileUrl,
        key: fileKey,
        bucket: this.bucket,
      };
    } catch (error) {
      const err = error as Error;
      console.log('FileUploader error:', err);
      throw new Error(`ファイルのアップロードに失敗しました: ${err.message}`);
    }
  }
}

export default new FileUploader();
