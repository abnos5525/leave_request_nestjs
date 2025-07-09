import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';

export function invalidRequestData(entity: string, uniqueMessage = '') {
  let message = `The entity does not exist`;
  if (uniqueMessage) {
    message = uniqueMessage;
  }
  return new HttpException(
    {
      error: 'INVALID_REQUEST_DATA',
      message,
      args: { entity },
    },
    HttpStatus.BAD_REQUEST,
  );
}

export function deletePermissionDenied(entity: string, reference: string) {
  return new HttpException(
    {
      error: 'DELETE_PERMISSION_DENIED',
      message: `The entity can not deleted due to a reference`,
      args: { entity, reference },
    },
    HttpStatus.BAD_REQUEST,
  );
}

export const requestPermissionDenied = new BadRequestException(
  'Your permission to do this action has denied',
  'REQUEST_PERMISSION_DENIED',
);

export const requestedInfoAlreadyExists = new BadRequestException(
  'There is already a record with requested info',
  'REQUESTED_INFO_ALREADY_EXISTS',
);

export function requestNotPossible(message?: string) {
  return new BadRequestException(
    message ?? 'This request is not possible',
    'REQUEST_NOT_POSSIBLE',
  );
}

export function requestedInfoNotFound(message?: string) {
  return new NotFoundException({
    error: 'REQUESTED_INFO_NOT_FOUND',
    message: message ?? 'The requested info not found',
  });
}

export const networkError = new RequestTimeoutException({
  error: 'NETWORK_ERROR',
  message: 'Network cant reach destination',
});
