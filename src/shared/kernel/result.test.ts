import { describe, expect, it } from "vitest";
import { err, isErr, isOk, ok } from "./result";

describe("Result", () => {
  it("ok() produces a status 'ok' result carrying the value", () => {
    const result = ok(42);
    expect(result).toEqual({ status: "ok", value: 42 });
  });

  it("err() produces a status 'error' result carrying the error", () => {
    const result = err("boom");
    expect(result).toEqual({ status: "error", error: "boom" });
  });

  it("isOk() narrows an ok result to true", () => {
    expect(isOk(ok(1))).toBe(true);
  });

  it("isOk() returns false for an error result", () => {
    expect(isOk(err("boom"))).toBe(false);
  });

  it("isErr() narrows an error result to true", () => {
    expect(isErr(err("boom"))).toBe(true);
  });

  it("isErr() returns false for an ok result", () => {
    expect(isErr(ok(1))).toBe(false);
  });
});
