# ディレクトリ構成

```
todo-app-express/
├── src/                       # ソースコード
│   ├── server.ts              # エントリーポイント
│   ├── controllers/           # コントローラー
│   │   ├── todo-controller.ts
│   │   └── user-controller.ts
│   ├── routes/                # ルート定義
│   │   └── api-routes.ts
│   ├── services/              # ビジネスロジック
│   │   ├── todo/
│   │   └── user/
│   ├── repositories/          # データアクセス層（Prisma）
│   ├── middleware/            # ミドルウェア
│   │   ├── auth-middleware.ts      # JWT認証
│   │   └── upload-middleware.ts    # ファイルアップロード
│   ├── requests/              # リクエストバリデーション
│   ├── responses/             # レスポンス型定義
│   ├── utils/                 # ユーティリティ
│   │   └── mail-sender.ts     # メール送信
│   ├── types/                 # 型定義
│   ├── configs/               # 設定ファイル
│   └── enums/                 # 列挙型
│
├── prisma/                    # Prisma設定
│   ├── schema.prisma          # データベーススキーマ
│   └── migrations/            # マイグレーションファイル
│
├── docs/                      # ドキュメント
│   ├── api/                   # API仕様
│   │   └── endpoints.md
│   ├── database/              # データベース仕様
│   │   └── schema.md
│   └── dir/                   # ディレクトリ構成
│       └── structure.md
│
├── api-tests/                 # API テストスクリプト
│
├── dist/                      # ビルド出力（gitignore対象）
│
├── node_modules/              # 依存パッケージ（gitignore対象）
│
├── .env                       # 環境変数（gitignore対象）
├── .env.sample                # 環境変数サンプル
├── Dockerfile                 # 本番用Dockerファイル
├── Dockerfile.dev             # 開発用Dockerファイル
├── entrypoint.sh              # コンテナエントリーポイント
├── Makefile                   # タスクランナー
├── package.json               # プロジェクト設定
├── tsconfig.json              # TypeScript設定
├── push-ecr.sh                # ECRプッシュスクリプト
└── README.md                  # プロジェクト説明
```

## 主要ディレクトリの説明

### `src/`

アプリケーションのソースコードを格納します。

#### `controllers/`

HTTPリクエストを受け取り、サービス層を呼び出して、レスポンスを返す責務を持ちます。

- `todo-controller.ts`: ToDo関連のコントローラー
- `user-controller.ts`: ユーザー関連のコントローラー

#### `routes/`

APIルートを定義します。

- `api-routes.ts`: `/api` 配下の全ルート定義

#### `services/`

ビジネスロジックを実装します。コントローラーから呼び出され、リポジトリ層を使用してデータアクセスを行います。

- `todo/`: ToDo関連のビジネスロジック
- `user/`: ユーザー関連のビジネスロジック

#### `repositories/`

Prismaを使用してデータベースにアクセスする層です。CRUD操作を抽象化します。

#### `middleware/`

Expressミドルウェアを格納します。

- `auth-middleware.ts`: JWT認証ミドルウェア
- `upload-middleware.ts`: ファイルアップロードミドルウェア（multer使用）

#### `requests/`

リクエストのバリデーションスキーマ（Zod等）を定義します。

#### `responses/`

レスポンスの型定義を格納します。

#### `utils/`

汎用的なユーティリティ関数を格納します。

- `mail-sender.ts`: メール送信機能（nodemailer + SES）

#### `types/`

アプリケーション全体で使用する型定義を格納します。

#### `configs/`

設定ファイル（DB接続、AWS SDK設定等）を格納します。

#### `enums/`

列挙型定義を格納します。

### `prisma/`

Prismaに関連するファイルを格納します。

- `schema.prisma`: データベーススキーマ定義
- `migrations/`: マイグレーションファイル（自動生成）

### `docs/`

プロジェクトのドキュメントを格納します。

- `api/endpoints.md`: API仕様
- `database/schema.md`: データベーススキーマ仕様
- `dir/structure.md`: ディレクトリ構成説明（本ドキュメント）

### `api-tests/`

APIテスト用のスクリプトやツール（curl、Postman等）を格納します。

## アーキテクチャパターン

このプロジェクトは **3層アーキテクチャ** を採用しています。

```
Controller → Service → Repository → Database
```

- **Controller**: HTTPリクエスト/レスポンスを処理
- **Service**: ビジネスロジックを実装
- **Repository**: データアクセスを抽象化
