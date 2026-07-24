import { describe, it, expect } from "vitest";
import { z } from "zod";
import { validateBody } from "./validation";

const schema = z.object({
  name: z.string().min(1),
  qty: z.number().int().positive(),
});

describe("validateBody", () => {
  it("accepts valid input and returns typed data", () => {
    const result = validateBody(schema, { name: "Poster", qty: 2 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.qty).toBe(2);
  });

  it("rejects invalid input with a non-empty error message", () => {
    const result = validateBody(schema, { name: "", qty: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.length).toBeGreaterThan(0);
  });
});
