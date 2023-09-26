export class HttpException extends Error {
  public status: number;
  public message: string;
  public isOperational: boolean;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
