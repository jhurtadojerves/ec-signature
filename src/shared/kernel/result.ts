export type Result<T, E> =
  | { readonly status: "ok"; readonly value: T }
  | { readonly status: "error"; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { status: "ok", value };
}

export function err<E>(error: E): Result<never, E> {
  return { status: "error", error };
}

export function isOk<T, E>(result: Result<T, E>): result is { status: "ok"; value: T } {
  return result.status === "ok";
}

export function isErr<T, E>(result: Result<T, E>): result is { status: "error"; error: E } {
  return result.status === "error";
}
