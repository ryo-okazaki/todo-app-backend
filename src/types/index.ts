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
  sub?: string;
  email: string;
  name: string;
  authType: 'todo-app' | 'keycloak';
}
