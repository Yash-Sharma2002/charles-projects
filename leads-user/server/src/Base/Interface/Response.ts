/**
 * Response Interface
 * Used to return response to the client
 */
interface ResponseInterface {
  status: number;
  message: string;
  data: any;
}

export default ResponseInterface;