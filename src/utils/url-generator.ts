import config from "../configs/config";

interface ImageOptions {
  endpoint?: string;
}

export const userTodoImageUrl = (userId: string, option?: ImageOptions) => {
  const prefix = `user/${userId}/todo`;
  if (option?.endpoint) {
    return `${config.get('CLOUDFRONT_URL')}/${prefix}`;
  }

  return prefix;
}

export const userAvatarUrl = (userId: string, option?: ImageOptions) => {
  const prefix = `user/${userId}/avatar`;
  if (option?.endpoint) {
    return `${config.get('CLOUDFRONT_URL')}/${prefix}`;
  }

  return prefix;
}
