import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { UserPayload } from "../types";
import userRepository from "../repositories/user-repository";

// 環境変数の検証
interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
  clientUrl: string;
}

function getKeycloakConfig(): KeycloakConfig {
  const url = process.env.KEYCLOAK_BASE_URL;
  const realm = process.env.KEYCLOAK_REALM;
  const clientId = process.env.KEYCLOAK_BACKEND_CLIENT_ID;
  const clientUrl = process.env.KEYCLOAK_CLIENT_URL;

  if (!url || !realm || !clientId || !clientUrl) {
    throw new Error('Keycloak configuration is missing');
  }

  return { url, realm, clientId, clientUrl };
}

const keycloakConfig = getKeycloakConfig();

// Keycloak公開鍵取得用クライアント
const jwksUri = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/certs`;
console.log('JWKS URI:', jwksUri);

const keycloakClient = jwksClient({
  jwksUri,
  cache: true,
  cacheMaxAge: 86400000, // 24時間
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});

// Keycloakの公開鍵を取得
function getKeycloakPublicKey(header: jwt.JwtHeader): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!header.kid) {
      return reject(new Error('Token header missing kid'));
    }

    keycloakClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        reject(err);
      } else {
        const signingKey = key?.getPublicKey();
        if (!signingKey) {
          reject(new Error('Unable to get signing key'));
        } else {
          resolve(signingKey);
        }
      }
    });
  });
}

// Keycloakトークンの検証
async function verifyKeycloakToken(token: string): Promise<UserPayload> {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded || !decoded.header.kid) {
        return reject(new Error('Invalid token format'));
      }

      const payload = decoded.payload as any;
      console.log('Token Issuer:', payload.iss);

      const publicKey = await getKeycloakPublicKey(decoded.header);

      // 期待されるIssuer（ブラウザがアクセスするURL）
      const expectedIssuer = `${keycloakConfig.clientUrl}/realms/${keycloakConfig.realm}`;

      console.log('Expected Issuer:', expectedIssuer);
      console.log('Token Issuer:', payload.iss);

      if (payload.iss !== expectedIssuer) {
        return reject(new Error(`Invalid issuer: ${payload.iss}. Expected: ${expectedIssuer}`));
      }

      // トークンを検証
      jwt.verify(
        token,
        publicKey,
        {
          algorithms: ['RS256'],
          issuer: expectedIssuer,
          audience: keycloakConfig.clientId,
        },
        async (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            const payload = decoded as any;
            const user = await userRepository.findUserBySub(payload.sub);

            resolve({
              userId: user.id,
              sub: payload.sub,
              email: payload.email,
              name: payload.name || payload.preferred_username,
              authType: 'keycloak',
            });
          }
        }
      );
    } catch (error) {
      console.log('keycloak verify token error: ', error);
      reject(error);
    }
  });
}

// 既存のToDoアプリトークン検証
function verifyTodoAppToken(token: string): UserPayload {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const decoded = jwt.verify(token, jwtSecret, {
    algorithms: ['HS256']
  }) as any;

  return {
    userId: decoded.userId,
    sub: undefined,
    email: decoded.email,
    name: decoded.name,
    authType: 'todo-app',
  };
}

// トークンのIssuerを確認して認証タイプを判別
function getTokenIssuer(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as any;
    return decoded?.iss || null;
  } catch {
    return null;
  }
}

// 統合認証ミドルウェア
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: '認証トークンがありません' });
    return;
  }

  try {
    const issuer = getTokenIssuer(token);
    console.log('Issuer:', issuer);

    if (!issuer) {
      res.status(401).json({ error: '無効なトークン形式です' });
      return;
    }

    let user: UserPayload;

    // Issuerに基づいて検証方法を切り替え
    if (issuer.includes('/realms/')) {
      // Keycloakトークン（audience検証を含む厳格な検証）
      user = await verifyKeycloakToken(token);
    } else {
      // 既存のToDoアプリトークン
      user = verifyTodoAppToken(token);
    }

    req.user = user;
    next();

  } catch (err) {
    console.error('Token verification error:', err);

    // エラーの種類に応じた適切なレスポンス
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'トークンが無効です' });
    } else if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'トークンの有効期限が切れています' });
    } else {
      res.status(500).json({ error: '認証処理中にエラーが発生しました' });
    }
    return;
  }
};
