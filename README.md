# ToDoアプリ API

## 概要

ToDoアプリケーションのバックエンドAPIです。ExpressとPrismaを使用し、RESTful APIを提供します。

## 主な機能

- **ユーザー管理**: 登録、ログイン、プロフィール更新、パスワードリセット
- **ToDo管理**: 作成、取得、更新、削除
- **画像保存**: AWS S3へのアップロード（ToDo画像、ユーザーアバター）
- **メール送信**: アカウント認証メール、パスワードリセットメール（nodemailer + SES）
- **JWT認証**: Keycloak連携によるトークン検証

## 技術スタック

- **Express**: 5.1.0
- **TypeScript**: 5.8.3
- **Prisma**: 6.7.0
- **PostgreSQL**: データベース
- **AWS S3**: 画像ストレージ
- **nodemailer**: メール送信
- **jsonwebtoken**: JWT認証
- **jwks-rsa**: Keycloak公開鍵取得
- **bcryptjs**: パスワードハッシュ化
- **multer**: ファイルアップロード

## 前提条件

- Node.js >= 18.x
- PostgreSQL
- AWS S3バケット（画像保存用）
- Keycloak認証サーバー

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd todo-app-express
```

### 2. 環境変数設定

`.env.sample` から `.env` を作成してください。

```bash
cp .env.sample .env
```

環境変数の詳細は各環境に応じて設定してください。

### 3. 依存関係のインストール

```bash
npm install
```

### 4. データベースマイグレーション

`make migrate` を実行してデータベースのマイグレーションを行います。

```bash
make migrate
```

または、Docker Compose環境外で実行する場合:

```bash
npm run migrate:dev
```

## 開発サーバーの起動

```bash
npm run dev
```

開発サーバーは `http://localhost:3001` で起動します（ポートは環境変数で変更可能）。

### デバッグモード

開発サーバーは自動的にデバッグモードで起動します。デバッガーは `0.0.0.0:9229` でリッスンします。

## API仕様

詳細なAPIエンドポイントとリクエスト/レスポンス仕様については、以下を参照してください。

- [API仕様](./docs/api/endpoints.md)

## データベース

データベーススキーマとマイグレーション手順については、以下を参照してください。

- [データベース](./docs/database/schema.md)

## 外部サービス連携

### 画像ストレージ（AWS S3）

- ToDo画像とユーザーアバターをS3にアップロード
- CloudFront経由で配信（環境変数 `CLOUDFRONT_URL`）
- アップロード後、S3のURLを返却

### メールサーバー（Amazon SES）

- アカウント認証メール送信
- パスワードリセットメール送信
- 環境変数で送信元アドレスを設定

### 認証基盤（Keycloak）

- JWT トークン検証
- JWKS（JSON Web Key Set）を使用してトークンの署名を検証
- 環境変数でKeycloakサーバーとRealmを設定

## ディレクトリ構成

詳細は [ディレクトリ構成](./docs/dir/structure.md) を参照してください。

## ビルド

```bash
npm run build
```

TypeScriptコードが `dist/` ディレクトリにコンパイルされます。

## 本番環境起動

```bash
npm run start
```

ビルド済みコードを本番モードで起動します。

## データベースコマンド

### マイグレーション

```bash
# 開発環境でマイグレーション適用
npm run migrate:dev

# マイグレーションステータス確認
npm run migrate:status

# マイグレーションリセット（全データ削除）
npm run migrate:reset

# 強制リセット（確認なし）
npm run migrate:force-reset
```

### Makefileコマンド（Docker Compose環境）

```bash
# コンテナ起動
make up

# コンテナ停止
make down

# マイグレーション実行
make migrate

# データベースリセット
make reset

# Expressコンテナ内でbash実行
make bash
```

## デプロイ

ECS へのデプロイは `todo-app-infrastructure` リポジトリで管理されています。

詳細は [todo-app-infrastructure](../todo-app-infrastructure) を参照してください。

## 関連リポジトリ

- [todo-app-infrastructure](../todo-app-infrastructure): インフラストラクチャ（Terraform）
- [todo-app-next](../todo-app-next): フロントエンド（Next.js）
- [app-authentication](../app-authentication): 共通認証基盤（Keycloak）
