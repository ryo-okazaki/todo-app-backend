# データベーススキーマ

## 概要

このアプリケーションは **PostgreSQL** をデータベースとして使用し、**Prisma** をORMとして使用しています。

## スキーマ定義

スキーマ定義は `prisma/schema.prisma` に記載されています。

## テーブル一覧

### users

ユーザー情報を管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|---|------|----------|------|
| id | INTEGER | NO | AUTO INCREMENT | ユーザーID（主キー） |
| sub | VARCHAR | YES | NULL | Keycloak Subject ID（SSO用） |
| authType | SMALLINT | NO | 1 | 認証タイプ（1: ローカル, 2: SSO） |
| name | VARCHAR(255) | NO | - | ユーザー名 |
| email | VARCHAR | NO | - | メールアドレス（ユニーク） |
| password | VARCHAR | YES | NULL | パスワードハッシュ（SSO時はNULL） |
| status | SMALLINT | NO | - | ステータス（0: 未認証, 1: 有効） |
| avatar_url | VARCHAR | YES | NULL | アバター画像URL |
| created_at | TIMESTAMP | NO | now() | 作成日時 |
| updated_at | TIMESTAMP | NO | - | 更新日時（自動更新） |

**インデックス**:
- PRIMARY KEY: `id`
- UNIQUE: `email`
- UNIQUE: `sub`

**リレーション**:
- `todos`: 1対多
- `verificationToken`: 1対多
- `passwordResetToken`: 1対多

---

### todos

ToDoアイテムを管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|---|------|----------|------|
| id | INTEGER | NO | AUTO INCREMENT | ToDo ID（主キー） |
| user_id | INTEGER | NO | - | ユーザーID（外部キー） |
| title | VARCHAR(255) | NO | - | ToDoタイトル |
| description | TEXT | YES | NULL | 説明文 |
| start_date | TIMESTAMP | YES | NULL | 開始日時 |
| end_date | TIMESTAMP | YES | NULL | 終了日時 |
| completed | BOOLEAN | NO | false | 完了フラグ |
| created_at | TIMESTAMP | NO | now() | 作成日時 |
| updated_at | TIMESTAMP | NO | - | 更新日時（自動更新） |

**インデックス**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `user_id` → `users(id)` (ON DELETE CASCADE)

**リレーション**:
- `user`: 多対1
- `images`: 1対多

---

### todo_images

ToDo画像を管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|---|------|----------|------|
| id | INTEGER | NO | AUTO INCREMENT | 画像ID（主キー） |
| todo_id | INTEGER | NO | - | ToDo ID（外部キー） |
| image_url | VARCHAR | NO | - | 画像URL（S3/CloudFront） |
| created_at | TIMESTAMP | NO | now() | 作成日時 |
| updated_at | TIMESTAMP | NO | - | 更新日時（自動更新） |

**インデックス**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `todo_id` → `todos(id)` (ON DELETE CASCADE)

**リレーション**:
- `todo`: 多対1

---

### verification_tokens

メールアドレス検証トークンを管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|---|------|----------|------|
| id | INTEGER | NO | AUTO INCREMENT | トークンID（主キー） |
| user_id | INTEGER | NO | - | ユーザーID（外部キー） |
| token | VARCHAR | NO | - | 検証トークン（ユニーク） |
| status | SMALLINT | NO | - | ステータス（0: 未使用, 1: 使用済み） |
| created_at | TIMESTAMP | NO | now() | 作成日時 |
| updated_at | TIMESTAMP | NO | - | 更新日時（自動更新） |

**インデックス**:
- PRIMARY KEY: `id`
- UNIQUE: `token`
- FOREIGN KEY: `user_id` → `users(id)` (ON DELETE CASCADE)

**リレーション**:
- `user`: 多対1

---

### password_reset_tokens

パスワードリセットトークンを管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|---|------|----------|------|
| id | INTEGER | NO | AUTO INCREMENT | トークンID（主キー） |
| user_id | INTEGER | NO | - | ユーザーID（外部キー） |
| token | VARCHAR | NO | - | リセットトークン（ユニーク） |
| expired_at | TIMESTAMP | NO | - | 有効期限 |
| status | SMALLINT | NO | - | ステータス（0: 未使用, 1: 使用済み） |
| created_at | TIMESTAMP | NO | now() | 作成日時 |
| updated_at | TIMESTAMP | NO | - | 更新日時（自動更新） |

**インデックス**:
- PRIMARY KEY: `id`
- UNIQUE: `token`
- FOREIGN KEY: `user_id` → `users(id)` (ON DELETE CASCADE)

**リレーション**:
- `user`: 多対1

---

## ER図

```
users (1) ──< (N) todos (1) ──< (N) todo_images
  │
  ├──< (N) verification_tokens
  │
  └──< (N) password_reset_tokens
```

## マイグレーション

### マイグレーション実行

```bash
# 開発環境
npm run migrate:dev

# Makefileを使用（Docker Compose環境）
make migrate
```

### マイグレーションステータス確認

```bash
npm run migrate:status
```

### マイグレーションリセット

**警告**: すべてのデータが削除されます。

```bash
# 確認付きリセット
npm run migrate:reset

# 強制リセット
npm run migrate:force-reset

# Makefileを使用（Docker Compose環境）
make reset
```

## データベース接続

データベース接続は環境変数 `DATABASE_URL` で設定します。

```bash
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

## Prisma Client

Prisma Clientは自動生成されます。スキーマ変更後は以下を実行してください。

```bash
npx prisma generate
```
