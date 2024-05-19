import ResponseInterface from "../Interface/Response";

/**
 * Response class
 * Used to return response to the client
 * @param status: number - status code
 * @param message: string - message
 * @param data: any - data
 */
class ResponseClass implements ResponseInterface {
  status: number = 200;
  message: string = "";
  data: any = "";

  constructor(status: number, message: string,data?: any) {
    this.status = status;
    this.message = message;
  }

  setStatus(status: number): void {
    this.status = status;
  }

  getStatus(): number {
    return this.status;
  }

  setMessage(message: string): void {
    this.message = message;
  }

  getMessage(): string {
    return this.message;
  }

  setData(data: any): void {
    this.data = data;
  }

  getData(): any {
    return this.data;
  }

  getResponse(): any {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
    };
  }
}

export default ResponseClass;
