import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El título es requerido')
    .max(200, 'El título no puede exceder 200 caracteres'),
  description: z
    .string()
    .trim()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional()
    .or(z.literal(''))
});

export const editTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El título es requerido')
    .max(200, 'El título no puede exceder 200 caracteres'),
  description: z
    .string()
    .trim()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional()
    .or(z.literal(''))
});

export const transformEmptyToUndefined = (data) => ({
  ...data,
  description: data.description === '' ? undefined : data.description
});