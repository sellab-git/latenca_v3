import type { ZodType } from "zod";

/** Result of validating input at a system boundary (API, form, webhook). */
export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/**
 * Validate unknown input against a Zod schema. Returns a typed result — never throws.
 * Use at every boundary (Route Handlers, Server Actions, webhooks) per coding rules.
 */
export function validateBody<T>(
  schema: ZodType<T>,
  body: unknown,
): ValidationResult<T> {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const error = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    return { ok: false, error };
  }
  return { ok: true, data: parsed.data };
}
