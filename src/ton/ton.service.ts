import { Injectable } from '@nestjs/common';
import TonWeb from 'tonweb';

@Injectable()
export class TonService {
  private tonweb: TonWeb;

  constructor() {
    this.tonweb = new TonWeb();
  }

  async getTransaction(params: {
    walletAddress: string;
    lt: number;
    hash: string;
  }) {
    const transaction = await this.tonweb.getTransactions(
      params.walletAddress,
      1,
      params.lt,
      params.hash,
    );

    const messages = transaction[0].out_msgs;
    const minCreatedLtMessage = messages.reduce((min, current) => {
      return parseInt(current.created_lt) < parseInt(min.created_lt)
        ? current
        : min;
    }, messages[0]);

    return minCreatedLtMessage;
  }
}
