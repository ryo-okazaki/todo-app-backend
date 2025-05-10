import config from "../configs/config";

interface TodoImageOptions {
  endpoint?: string;
}

export const userTodoImageUrl = (userId: string, option?: TodoImageOptions) => {
  const prefix = `user/${userId}/todo`;
  if (option?.endpoint) {
    return `${config.get('CLOUDFRONT_URL')}/${prefix}`;
  }

  return prefix;
}
