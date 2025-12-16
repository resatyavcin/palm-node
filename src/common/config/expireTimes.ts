import type { StringValue } from 'ms';
import { parseExpire } from './jwt-expire.util';

export const JWT_EXPIRES: {
  ACCESS_TOKEN_EXPIRE_TIME: StringValue | number;
  REFRESH_TOKEN_EXPIRE_TIME: StringValue | number;
} = {
  ACCESS_TOKEN_EXPIRE_TIME: parseExpire(
    process.env.ACCESS_TOKEN_EXPIRE_TIME,
    '15m',
  ),
  REFRESH_TOKEN_EXPIRE_TIME: parseExpire(
    process.env.REFRESH_TOKEN_EXPIRE_TIME,
    '7d',
  ),
};
