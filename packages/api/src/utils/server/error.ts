import {HttpErrorCodes} from "../httpStatusCode.js";

export class ApiError extends Error {
  statusCode: HttpErrorCodes;
  constructor(statusCode: HttpErrorCodes, message?: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
