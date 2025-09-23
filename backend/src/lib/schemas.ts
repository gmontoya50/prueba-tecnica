import { z } from 'zod';

export const CreateTodoSchema = z.object({
  title: z.string().trim().min(1, 'title requerido').max(200),
  description: z.string().trim().max(1000).optional(),
  completed: z.boolean().optional(),
  attachmentKey: z.string().trim().max(512).nullable().optional(),
});

export const UpdateTodoSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(1000).optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar',
  });

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;
