// todo: need to fix

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export interface UserPayload {
  userId: number;
  username: string;
  email: string;
}
