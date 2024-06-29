import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  workingDirectory: process.env.PWD || process.cwd(),
  port: process.env.APP_PORT || 3000,
  apiPrefix: process.env.API_PREFIX,
  frontendDomain: process.env.FRONTEND_DOMAIN,
}));
