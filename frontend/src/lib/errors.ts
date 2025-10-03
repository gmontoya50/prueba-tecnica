import { ApiError } from './api';

export type UiError = { isError: boolean; message: string };

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Unexpected error, please try again later.';
};

export const createError = (message: string): UiError => ({ isError: true, message });
export const emptyError: UiError = { isError: false, message: '' };
