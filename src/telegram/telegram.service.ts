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
    const userOld = await this.userService.findOne({
      telegramId: info?.id.toString(),
    });

    if (userOld) {
      await this.showToolbarButton(ctx);
      return;
    }

    const referralLink = message.text?.split(' ')[1];

    if (referralLink) {
      const userNew = await this.authService.register({
        telegramId: info?.id.toString(),
        telegramUsername: info?.last_name,
        firstName: info?.first_name,
        lastName: info?.last_name,
        languageCode: info?.language_code,
        referrerTelegramId: referralLink,
      });

      if (userNew) {
        return this.showToolbarButton(ctx);
      }
    } else {
      const userNew = await this.authService.register({
        telegramId: info?.id.toString(),
        telegramUsername: info?.last_name,
        firstName: info?.first_name,
        lastName: info?.last_name,
        languageCode: info?.language_code,
      });

      if (userNew) {
        return this.showToolbarButton(ctx);
      }
    }
  }

  private async generateRefLink(ctx: Context) {
    const telegramId = ctx.from?.id;
    if (!telegramId) return;

    const refLink = `https://t.me/BatGunner_Bot?start=${telegramId}`;
    await ctx.reply(`Your referral link: ${refLink}`, {
      reply_markup: {
        inline_keyboard: [[{ text: 'Share Referral Link', url: refLink }]],
      },
    });
  }

  private async showToolbarButton(ctx: Context) {
    await ctx.reply(INTRODUCE, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Launch App',
              web_app: {
                url: this.configService.getOrThrow('app.frontendDomain'),
              },
            },
          ],
          [{ text: 'Get Referral Link', callback_data: 'genReferralLink' }],
        ],
      },
    });
  }
}
