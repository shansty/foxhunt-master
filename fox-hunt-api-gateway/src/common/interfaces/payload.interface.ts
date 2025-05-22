export interface AccessTokenPayload {
  organizationId?: number;
  email: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  organizationId: number;
  email: string;
  refreshTokenId: number;
  iat: number;
  exp: number;
}
