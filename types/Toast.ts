export class Toast {
  message?: string;
  code?: number;
  type?: string;

  constructor(message: string, code: number, type: string) {
    this.message = message;
    this.code = code;
    this.type = type;
  }
}