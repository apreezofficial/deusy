import type { ActionResult } from "@/lib/actions/result";

/**
 * Adapts a plain FormData server action to the signature useActionState expects,
 * so the same action can be called from a form and from a handler.
 */
export function formAction<T>(action: (formData: FormData) => Promise<ActionResult<T>>) {
  return async (
    _previous: ActionResult<T> | null,
    formData: FormData,
  ): Promise<ActionResult<T>> => action(formData);
}
