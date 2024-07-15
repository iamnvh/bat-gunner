import { BadGatewayException, Injectable } from '@nestjs/common';
import { getTransaction } from 'src/utils/func-helper';

@Injectable()
export class TonService {
  async getTransaction(hash: string) {
    try {
      const transaction = await getTransaction(hash);
      return transaction.data.out_msgs;
    } catch (error) {
      throw new BadGatewayException(`${error}`);
    }
  }
}
