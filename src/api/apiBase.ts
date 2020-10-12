import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export abstract class ApiBase {
  constructor() {
    this.axiosInstance = this.setupClient();
  }

  protected axiosInstance: AxiosInstance;

  private setupClient() {
    const options: AxiosRequestConfig = {
      //60 sec timeout
      timeout: 60000,
      //follow up to 10 HTTP 3xx redirects
      maxRedirects: 10,
      //cap the maximum content length we'll accept to 50MBs, just in case
      maxContentLength: 50 * 1000 * 1000
    };
    const axiosInstance = axios.create(options);

    axiosInstance.interceptors.response.use(
      res => res,
      err => {
        if (err.response) {
          let message = `${err.response.statusText}-${err.response.status}`;
          const responseMessage = err.response.data.message;
          if (responseMessage) { message += `: ${responseMessage}`;}
          throw new Error(message);
        } else {
          throw new Error(err.message);
        }
      }
    );
    return axiosInstance;
  }
}