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

/** Same adapter for plain forms that manage their own result state. */
export function voidAction<T>(action: (formData: FormData) => Promise<ActionResult<T>>) {
  return async (formData: FormData): Promise<void> => {
    await action(formData);
  };
}
