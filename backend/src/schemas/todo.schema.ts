import { z } from 'zod';

const parseJsonBody = <T extends z.ZodTypeAny>(inner: T) =>
  z
    .string()
    .min(1, 'body is required')
    .transform((raw, ctx) => {
      try {
        return JSON.parse(raw);
      } catch {
        ctx.addIssue({ code: 'custom', message: 'invalid JSON' });
        return z.NEVER;
      }
    })
    .pipe(inner);

const parseOptionalJsonBody = <T extends z.ZodTypeAny>(inner: T) =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((raw, ctx) => {
      if (raw == null) return undefined;
      if (raw.trim() === '') return undefined;
      try {
        return JSON.parse(raw);
      } catch {
        ctx.addIssue({ code: 'custom', message: 'invalid JSON' });
        return z.NEVER;
      }
    })
    .pipe(inner.optional());

const idParamSchema = z.object({
  id: z.uuid({ message: 'invalid id' }),
});

const todoBodySchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(300, 'title is too large'),
  description: z.string().max(2000, 'description is too large').default(''),
  completed: z.boolean().default(false),
  attachmentKey: z.string().nullable().default(null),
});

const createTodoSchema = parseJsonBody(todoBodySchema);

const updateTodoBodySchema = todoBodySchema.omit({ title: true }).extend({
  title: todoBodySchema.shape.title.optional(),
});

const updateTodoPutSchema = parseJsonBody(updateTodoBodySchema);

const deleteTodoBodySchema = parseOptionalJsonBody(
  z.object({
    retainDays: z.coerce
      .number()
      .int()
      .min(0, 'retainDays must be a non-negative number')
      .optional(),
  })
);

const listTodosQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z
    .string()
    .optional()
    .transform((b64, ctx) => {
      if (!b64) return undefined;
      try {
        const json = Buffer.from(b64, 'base64').toString('utf8');
        return JSON.parse(json) as { id: string };
      } catch {
        ctx.addIssue({ code: 'custom', message: 'invalid cursor' });
        return z.NEVER;
      }
    }),
});


export {
  idParamSchema,
  createTodoSchema,
  updateTodoPutSchema,
  deleteTodoBodySchema,
  listTodosQuerySchema,
};
