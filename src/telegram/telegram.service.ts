import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { INTRODUCE } from 'src/utils/constants';
import { Telegraf, Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

export class TelegramService {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.bot.start((ctx) => this.start(ctx));
    this.bot.action('genReferralLink', (ctx) => this.generateRefLink(ctx));
  }

  private async start(ctx: Context) {
    const message = ctx.message as Message.TextMessage;

    if (!message || !message?.from) {
      return;
    }

    const info = message?.from;
    const userOld = await this.userService.findUserByTelegramId(
      info?.id.toString(),
    );

    if (userOld) {
      await this.showToolbarButton(ctx, userOld?.telegramId);
      return;
    }

    const userNew = await this.authService.register({
      telegramId: info?.id.toString(),
      telegramUsername: info?.username,
      firstName: info?.first_name,
      lastName: info?.last_name,
      languageCode: info?.language_code,
      referrerTelegramId: message.text?.split(' ')[1],
    });

    if (userNew) {
      return this.showToolbarButton(ctx, info?.id.toString());
    }
  }

  private async generateRefLink(ctx: Context) {
    const telegramId = ctx.from?.id;
    if (!telegramId) return;

    const refLink = `https://t.me/${this.configService.get(
      'bot.botUsername',
    )}?start=${telegramId}`;
    await ctx.reply(`Your referral link: ${refLink}`, {
      reply_markup: {
        inline_keyboard: [[{ text: 'Share Referral Link', url: refLink }]],
      },
    });
  }

  private async showToolbarButton(ctx: Context, telegramId: string) {
    const url = `${this.configService.getOrThrow(
      'app.frontendDomain',
    )}?telegramId=${telegramId}`;
    await ctx.reply(INTRODUCE, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Launch App',
              web_app: {
                url: url,
              },
            },
          ],
          [{ text: 'Get Referral Link', callback_data: 'genReferralLink' }],
        ],
      },
    });
  }
}
