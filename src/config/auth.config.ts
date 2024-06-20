import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  access_secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
  access_expires: process.env.ACCESS_TOKEN_LIFE_TIME,
  refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
  refresh_expires: process.env.REFRESH_TOKEN_LIFE_TIME,
}));
