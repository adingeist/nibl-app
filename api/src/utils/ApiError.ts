export class ApiError extends Error {
  status: number;

  constructor(status: number, m: string) {
    super(m);
    this.status = status;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
