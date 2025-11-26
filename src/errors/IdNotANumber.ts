export class IdNotANumberError extends Error {
  public code: number;
  constructor(message: string = "idNotANumberError") {
    super(message);
    this.code = 400;
  }
}
