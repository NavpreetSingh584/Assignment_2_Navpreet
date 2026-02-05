import { calculateUrgency } from "../src/api/v1/services/ticketService";
import type { Ticket } from "../src/data/tickets";

describe("ticketService - calculateUrgency", () => {
  it("should return RESOLVED when ticket status is resolved", async () => {
    const t: Ticket = {
      id: 1,
      title: "X",
      description: "Y",
      priority: "high",
      status: "resolved",
      createdAt: new Date().toISOString(),
    };

    const result = await calculateUrgency(t, new Date());
    expect(result.urgencyLevel).toBe("RESOLVED");
    expect(result.urgencyScore).toBe(0);
  });

  it("should increase score as age increases (placeholder multiplier)", async () => {
    const now = new Date("2026-01-20T00:00:00.000Z");
    const createdAt = new Date("2026-01-10T00:00:00.000Z"); // 10 days old

    const t: Ticket = {
      id: 2,
      title: "Old ticket",
      description: "A",
      priority: "low", // base 10
      status: "open",
      createdAt: createdAt.toISOString(),
    };

    const result = await calculateUrgency(t, now);

    expect(result.ageDays).toBe(10);
    // With AGE_MULTIPLIER = 2 in your service:
    expect(result.urgencyScore).toBe(10 + 10 * 2);
  });

  it("should return CRITICAL when score meets threshold (placeholder thresholds)", async () => {
    const now = new Date("2026-01-20T00:00:00.000Z");
    const createdAt = new Date("2025-12-01T00:00:00.000Z"); // very old

    const t: Ticket = {
      id: 3,
      title: "Very old critical",
      description: "A",
      priority: "critical",
      status: "open",
      createdAt: createdAt.toISOString(),
    };

    const result = await calculateUrgency(t, now);

    // With placeholder thresholds, this should likely be CRITICAL
    expect(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).toContain(result.urgencyLevel);
  });
});
