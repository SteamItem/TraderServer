import axios, { AxiosInstance } from "axios";

export abstract class ApiBase {
  constructor() {
    this.axiosInstance = this.setupClient();
  }

  private setupClient() {
    const axiosInstance = axios.create();
    axiosInstance.interceptors.response.use(
      res => res,
      err => {
        if (err.response) {
          var message = `${err.response.statusText}-${err.response.status}`;
          var responseMessage = err.response.data.message;
          if (responseMessage) { message += `: ${responseMessage}`;}
          throw new Error(message);
        } else {
          throw new Error(err.message);
        }
      }
    );
    return axiosInstance;
  }

  protected axiosInstance: AxiosInstance;
}