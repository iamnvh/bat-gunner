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
  ) {
    this.bot.start((ctx) => this.start(ctx));
    this.bot.action('genReferralLink', (ctx) => this.generateRefLink(ctx));
  }

  private async start(ctx: Context) {
    const message = ctx.message as Message.TextMessage;
    const infoTelegram = ctx.from;

    if (!infoTelegram?.username || !infoTelegram?.id || !message) {
      console.error('Telegram user information is incomplete.');
      return;
    }

    const userOld = await this.userService.findOne({
      telegramId: infoTelegram.id.toString(),
      telegramUsername: infoTelegram.username,
    });

    if (userOld) {
      await this.showToolbarButton(ctx);
      return;
    }

    const refLink = message.text?.split(' ')[1];
    if (refLink) {
      const userNew = await this.authService.register({
        telegramId: infoTelegram.id.toString(),
        telegramUsername: infoTelegram.username,
        referrerTelegramId: refLink,
      });

      if (userNew) {
        return this.showToolbarButton(ctx);
      }
    } else {
      await ctx.reply('You need to have a referral link!!!');
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
    const webAppUrl = 'https://mini.cupiee.com/';
    await ctx.reply(INTRODUCE, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Launch App', web_app: { url: webAppUrl } }],
          [{ text: 'Get Referral Link', callback_data: 'genReferralLink' }],
        ],
      },
    });
  }
}
