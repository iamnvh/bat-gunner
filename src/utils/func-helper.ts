import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

const StatusCode = {
  SUCCESS: 1,
  FAIL: 0,
};

export const ResponseAPI = {
  Success: ({
    data,
    message = 'success',
    status = HttpStatus.OK,
    response,
  }: {
    data?: any;
    message?: string;
    status?: HttpStatus;
    response: Response;
  }) => {
    response.status(status).send({ code: StatusCode.SUCCESS, message, data });
  },
  Fail: ({
    data,
    message = 'fail',
    status = HttpStatus.BAD_REQUEST,
    response,
  }: {
    data?: any;
    message?: string;
    status?: HttpStatus;
    response: Response;
  }) => {
    response
      .status(status || HttpStatus.BAD_REQUEST)
      .send({ code: StatusCode.FAIL, message, data });
  },
};

export const formatNotificationPayload = (obj) => {
  if (!obj) {
    return null;
  }
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
      continue;
    }
    if (typeof obj[key] !== 'string') {
      obj[key] = JSON.stringify(obj[key]);
    }
  }
  return obj;
};

export const checkDate = (date1: Date, date2: Date) => {
  return date1.toDateString() === date2.toDateString();
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// export const getTransactions = async (params: {
//   address: string;
//   hash: string;
//   limit: number;
//   method: string;
//   headers?: any;
// }) => {
//   try {
//     const config = {
//       method: params.method,
//       maxBodyLength: Infinity,
//       url: 'https://toncenter.com/api/v2/getTransactions',
//       headers: params.headers || {},
//       params: {
//         address: params.address,
//         hash: params.hash,
//         limit: params.limit,
//       },
//     };

//     const response = await axios.request(config);
//     return response;
//   } catch (error) {
//     console.error(error);
//   }
// };

export const getTransaction = async (hash: string) => {
  while (true) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://tonapi.io/v2/blockchain/transactions/${hash}`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TON_API_KEY}`,
      },
    };

    const response = await axios.request(config);

    if (response.status == 200) {
      return response;
    }

    await delay(5000);
    console.log('ERROR GET TRANSACTION');
  }
};
