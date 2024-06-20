import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as AES from 'crypto-js/aes';
import * as encUTF8 from 'crypto-js/enc-utf8';

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

export const decrypt = (encryptedMessage) => {
  if (!encryptedMessage || !process.env.MESSAGE_SECRET_KEY) {
    return null;
  }
  const bytes = AES.decrypt(encryptedMessage, process.env.MESSAGE_SECRET_KEY);
  return bytes.toString(encUTF8);
};

export const getCompletedProfile = (obj: any) => {
  const arrField = [
    'photos',
    'aboutMe',
    'livingIn',
    'status',
    'starSign',
    'sexuality',
    'drinking',
    'smoking',
    'pets',
    'languages',
    'hobbies',
    'quotes',
  ];
  const valueListCheck = arrField.filter(
    (field) =>
      obj[field] !== null ||
      (Array.isArray(obj[field]) && !!obj[field]?.length),
  );
  return Math.round((valueListCheck.length / arrField.length) * 100);
};
