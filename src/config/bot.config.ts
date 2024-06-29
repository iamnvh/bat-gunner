import { registerAs } from '@nestjs/config';

export default registerAs('bot', () => ({
  botUsername: process.env.BOT_USERNAME,
}));
