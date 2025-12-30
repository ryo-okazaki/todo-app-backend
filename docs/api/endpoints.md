# API仕様

## ベースURL

```
http://localhost:3001/api
```

## 認証

ほとんどのエンドポイントはJWT認証が必要です。リクエストヘッダーに以下を含めてください。

```
Authorization: Bearer <JWT_TOKEN>
```

## ToDo関連エンドポイント

### GET /api/todo

ToDo一覧を取得します。

**認証**: 必要

**レスポンス**:
```json
[
  {
    "id": 1,
    "userId": 1,
    "title": "サンプルToDo",
    "description": "説明文",
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-01-31T23:59:59.000Z",
    "completed": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "images": [
      {
        "id": 1,
        "todoId": 1,
        "imageUrl": "https://cdn.example.com/image.jpg",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ]
  }
]
```

### GET /api/todo/:id

指定されたIDのToDoを取得します。

**認証**: 必要

**パラメータ**:
- `id` (number): ToDo ID

**レスポンス**:
```json
{
  "id": 1,
  "userId": 1,
  "title": "サンプルToDo",
  "description": "説明文",
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-01-31T23:59:59.000Z",
  "completed": false,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "images": []
}
```

### POST /api/todo

新しいToDoを作成します。

**認証**: 必要

**リクエストボディ**:
```json
{
  "title": "新しいToDo",
  "description": "説明文",
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-01-31T23:59:59.000Z"
}
```

**レスポンス**:
```json
{
  "id": 2,
  "userId": 1,
  "title": "新しいToDo",
  "description": "説明文",
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-01-31T23:59:59.000Z",
  "completed": false,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### PUT /api/todo/:id

指定されたIDのToDoを更新します。画像アップロードも可能です。

**認証**: 必要

**Content-Type**: `multipart/form-data`

**パラメータ**:
- `id` (number): ToDo ID

**リクエストボディ (Form Data)**:
- `title` (string): タイトル
- `description` (string): 説明文
- `startDate` (string): 開始日時
- `endDate` (string): 終了日時
- `completed` (boolean): 完了フラグ
- `images` (File[]): 画像ファイル（複数可）

**レスポンス**:
```json
{
  "id": 1,
  "userId": 1,
  "title": "更新されたToDo",
  "description": "更新された説明文",
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-01-31T23:59:59.000Z",
  "completed": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-02T00:00:00.000Z",
  "images": [
    {
      "id": 1,
      "todoId": 1,
      "imageUrl": "https://cdn.example.com/image.jpg",
      "createdAt": "2025-01-02T00:00:00.000Z",
      "updatedAt": "2025-01-02T00:00:00.000Z"
    }
  ]
}
```

## ユーザー関連エンドポイント

### POST /api/user/login

ユーザーログイン（JWT認証）

**認証**: 不要

**リクエストボディ**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "ユーザー名",
    "email": "user@example.com",
    "avatar_url": "https://cdn.example.com/avatar.jpg"
  }
}
```

### POST /api/user/register

新規ユーザー登録

**認証**: 不要

**リクエストボディ**:
```json
{
  "name": "新規ユーザー",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**レスポンス**:
```json
{
  "id": 2,
  "name": "新規ユーザー",
  "email": "newuser@example.com",
  "status": 0
}
```

**備考**: 登録後、アカウント認証メールが送信されます。

### GET /api/user

ログイン中のユーザー情報を取得

**認証**: 必要

**レスポンス**:
```json
{
  "id": 1,
  "sub": "keycloak-sub-id",
  "authType": 1,
  "name": "ユーザー名",
  "email": "user@example.com",
  "status": 1,
  "avatar_url": "https://cdn.example.com/avatar.jpg",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### PUT /api/user

ユーザー情報更新（アバター画像アップロード対応）

**認証**: 必要

**Content-Type**: `multipart/form-data`

**リクエストボディ (Form Data)**:
- `name` (string): ユーザー名
- `email` (string): メールアドレス
- `avatar` (File): アバター画像ファイル

**レスポンス**:
```json
{
  "id": 1,
  "name": "更新されたユーザー名",
  "email": "user@example.com",
  "avatar_url": "https://cdn.example.com/new-avatar.jpg",
  "updatedAt": "2025-01-02T00:00:00.000Z"
}
```

### PUT /api/user/sso_sync

SSOアカウント同期

**認証**: 必要

**リクエストボディ**:
```json
{
  "sub": "keycloak-sub-id",
  "name": "SSO ユーザー名",
  "email": "ssouser@example.com"
}
```

**レスポンス**:
```json
{
  "id": 1,
  "sub": "keycloak-sub-id",
  "name": "SSO ユーザー名",
  "email": "ssouser@example.com",
  "authType": 2,
  "updatedAt": "2025-01-02T00:00:00.000Z"
}
```

### POST /api/user/reset_password/request

パスワードリセット要求

**認証**: 不要

**リクエストボディ**:
```json
{
  "email": "user@example.com"
}
```

**レスポンス**:
```json
{
  "message": "パスワードリセットメールを送信しました"
}
```

**備考**: パスワードリセット用のトークン付きメールが送信されます。

### POST /api/user/reset_password/confirm

パスワードリセット確認

**認証**: 不要

**リクエストボディ**:
```json
{
  "token": "reset-token-string",
  "newPassword": "newpassword123"
}
```

**レスポンス**:
```json
{
  "message": "パスワードがリセットされました"
}
```

### POST /api/user/verify/:token

メールアドレス検証

**認証**: 不要

**パラメータ**:
- `token` (string): 検証トークン

**レスポンス**:
```json
{
  "message": "アカウントが有効化されました"
}
```

## エラーレスポンス

エラー時は以下の形式でレスポンスが返されます。

```json
{
  "error": "エラーメッセージ",
  "details": "詳細情報（任意）"
}
```

### ステータスコード

- `200 OK`: リクエスト成功
- `201 Created`: リソース作成成功
- `400 Bad Request`: リクエストが不正
- `401 Unauthorized`: 認証エラー
- `403 Forbidden`: 権限エラー
- `404 Not Found`: リソースが見つからない
- `500 Internal Server Error`: サーバーエラー
