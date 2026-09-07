export type Ok<T> = { readonly status: "ok"; readonly value: T };
export type Err<E> = { readonly status: "error"; readonly error: E };
export type Result<T, E> = Ok<T> | Err<E>;

export function ok<T>(value: T): Result<T, never> {
  return { status: "ok", value };
}

export function err<E>(error: E): Result<never, E> {
  return { status: "error", error };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.status === "ok";
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.status === "error";
}
