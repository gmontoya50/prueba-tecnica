import axios, { AxiosInstance } from 'axios';

export interface RequestOptions<TBody = any> {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: TBody;
  params?: any;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: unknown
  ) {
    super(message);
  }
}

export class ApiClient {
  private readonly instance: AxiosInstance;

  constructor(baseURL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:4000') {
    this.instance = axios.create({ baseURL });
  }

  async request<TResponse = any, TBody = any>(options: RequestOptions<TBody>): Promise<TResponse> {
    try {
      const response = await this.instance({
        method: options.method,
        url: options.url,
        headers: options.headers,
        data: options.body,
        params: options.params,
      });

      return response.data as TResponse;
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private mapError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const payload = error.response?.data as { message?: string } | undefined;
      const message = payload?.message ?? error.message ?? 'Unexpected error';
      return new ApiError(status, message, payload);
    }

    if (error instanceof Error) {
      return new ApiError(500, error.message, { cause: error });
    }

    return new ApiError(500, 'Unexpected error', error);
  }
}

export const apiClient = new ApiClient();

export const request = <TResponse = any, TBody = any>(options: RequestOptions<TBody>) =>
  apiClient.request<TResponse, TBody>(options);
