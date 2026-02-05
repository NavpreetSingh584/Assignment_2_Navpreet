import request from "supertest";
import app from "../src/app";
import { resetTicketsStore } from "../src/data/tickets";

describe("Ticket Routes (Integration)", () => {
  beforeEach(() => {
    resetTicketsStore();
  });

  it("GET /api/v1/tickets should return all tickets", async () => {
    const res = await request(app).get("/api/v1/tickets");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/v1/tickets/:id should return one ticket", async () => {
    const res = await request(app).get("/api/v1/tickets/1");

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  it("GET /api/v1/tickets/:id should return 404 if not found", async () => {
    const res = await request(app).get("/api/v1/tickets/9999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Ticket not found");
  });

  it("POST /api/v1/tickets should create ticket", async () => {
    const res = await request(app).post("/api/v1/tickets").send({
      title: "New Ticket",
      description: "Something broke",
      priority: "low",
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.status).toBe("open");
    expect(res.body.data).toHaveProperty("createdAt");
  });

  it("POST /api/v1/tickets should return 400 when title missing", async () => {
    const res = await request(app).post("/api/v1/tickets").send({
      description: "Something broke",
      priority: "low",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing required field: title");
  });

  it("PUT /api/v1/tickets/:id should update ticket", async () => {
    const res = await request(app).put("/api/v1/tickets/1").send({
      status: "in-progress",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("in-progress");
  });

  it("PUT /api/v1/tickets/:id should return 400 for invalid status", async () => {
    const res = await request(app).put("/api/v1/tickets/1").send({
      status: "done",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid status. Must be one of: open, in-progress, resolved");
  });

  it("DELETE /api/v1/tickets/:id should delete ticket", async () => {
    const res = await request(app).delete("/api/v1/tickets/1");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Ticket deleted successfully");
  });
});
        