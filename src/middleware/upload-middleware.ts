// src/middleware/upload-middleware.ts
import multer from 'multer';

// メモリストレージを使用
const storage = multer.memoryStorage();

// アップロードファイルフィルター
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('サポートされていないファイル形式です'), false);
  }
};

// 単一ファイルアップロード用
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB制限
}).single('image');

// 複数ファイルアップロード用
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB制限/ファイル
    files: 5 // 最大5ファイルまで
  }
}).array('images', 5); // 'images'フィールドで最大5枚まで
