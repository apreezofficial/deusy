import type { ZodError } from "zod";

export interface ActionError {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
}

export type ActionResult<T = void> = { ok: true; data: T } | ActionError;

export function actionError(
  error: string,
  fieldErrors?: Record<string, string>,
): ActionError {
  return fieldErrors ? { ok: false, error, fieldErrors } : { ok: false, error };
}

/** Turns zod issues into one message per field for inline display. */
export function fieldErrorsFrom(issues: ZodError["issues"]) {
  const result: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in result)) result[key] = issue.message;
  }
  return result;
}
