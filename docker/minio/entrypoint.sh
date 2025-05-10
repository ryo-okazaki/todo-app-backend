#!/bin/sh

# MinIOサーバーをバックグラウンドで起動
minio server /data --console-address ":9001" &

# サーバーのPIDを保存
MINIO_PID=$!

# サーバーが準備できるまで待機
echo "MinIOサーバーの起動を待機中..."
while ! curl -s http://localhost:9000/minio/health/live > /dev/null; do
  sleep 1
done
echo "MinIOサーバー起動完了"

# AWS CLIを設定
mc alias set myminio http://localhost:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

# バケットが存在するか確認し、なければ作成
if ! mc ls myminio/mybucket > /dev/null 2>&1; then
  echo "バケット 'mybucket' を作成中..."
  mc mb myminio/mybucket
  echo "バケット作成完了"
else
  echo "バケット 'mybucket' は既に存在します"
fi

# フォアグラウンドでMinIOプロセスを維持するため、MinIOプロセスを待機
wait $MINIO_PID
