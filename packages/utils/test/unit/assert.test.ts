import {describe, expect, it} from "vitest";
import {assert} from "../../src/index.js";

describe("assert", () => {
  describe("true", () => {
    it("Should not throw with true", () => {
      expect(() => assert.true(true)).not.toThrow();
    });
    it("Should throw with false", () => {
      expect(() => assert.true(false, "something must be valid")).toThrow("something must be valid");
    });
  });

  describe("equal with custom message", () => {
    it("Should not throw with equal values", () => {
      expect(() => assert.equal(1, 1)).not.toThrow();
    });
    it("Should throw with different values", () => {
      expect(() => assert.equal(1, 2, "something must be equal")).toThrow("something must be equal: 1 === 2");
    });
  });

  describe("notNull with custom message", () => {
    it("Should not throw error with not null value", () => {
      expect(() => assert.notNull(0)).not.toThrow();
      expect(() => assert.notNull("")).not.toThrow();
    });
    it("Should throw with null value", () => {
      expect(() => assert.notNull(null, "something must not be null")).toThrow("something must not be null");
    });
  });

  const cases: {
    op: keyof Omit<typeof assert, "true" | "notNull">;
    args: [number, number];
    ok: boolean;
  }[] = [
    {op: "equal", args: [0, 1], ok: false},
    {op: "equal", args: [1, 1], ok: true},
    {op: "equal", args: [2, 1], ok: false},

    {op: "lte", args: [0, 1], ok: true},
    {op: "lte", args: [1, 1], ok: true},
    {op: "lte", args: [2, 1], ok: false},

    {op: "lt", args: [0, 1], ok: true},
    {op: "lt", args: [1, 1], ok: false},
    {op: "lt", args: [2, 1], ok: false},

    {op: "gte", args: [0, 1], ok: false},
    {op: "gte", args: [1, 1], ok: true},
    {op: "gte", args: [2, 1], ok: true},

    {op: "gt", args: [0, 1], ok: false},
    {op: "gt", args: [1, 1], ok: false},
    {op: "gt", args: [2, 1], ok: true},
  ];

  describe("math ops", () => {
    for (const {op, args, ok} of cases) {
      it(`assert ${args[0]} ${op} ${args[1]} = ${ok}`, () => {
        if (ok) {
          expect(() => assert[op](...args)).not.toThrow();
        } else {
          expect(() => assert[op](...args)).toThrow();
        }
      });
    }
  });
});
