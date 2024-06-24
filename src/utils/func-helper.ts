import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

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
