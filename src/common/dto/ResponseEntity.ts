import { HttpStatus } from '@nestjs/common';

export class ResponseEntity<T> {
  data?: T;
  message: string;
  error?: string;
  httpStatus?: HttpStatus;
  status: boolean;
  constructor(partial: Partial<ResponseEntity<T>>) {
    Object.assign(this, partial);
  }
}
