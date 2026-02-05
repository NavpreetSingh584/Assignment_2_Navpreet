import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as ticketController from "../src/api/v1/controllers/ticketController";
import * as ticketService from "../src/api/v1/services/ticketService";
import type { Ticket } from "../src/data/tickets";

jest.mock("../src/api/v1/services/ticketService");

describe("Ticket Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = { params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("getTickets", () => {
    it("should handle successful operation", async () => {
      const mockTickets: Ticket[] = [
        {
          id: 1,
          title: "Test Ticket",
          description: "Test description",
          priority: "low",
          status: "open",
          createdAt: new Date().toISOString(),
        },
      ];

      (ticketService.getAllTickets as jest.Mock).mockResolvedValue(mockTickets);

      await ticketController.getTickets(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Tickets retrieved successfully",
        data: mockTickets,
      });
    });

    it("should call next(error) if service throws", async () => {
      (ticketService.getAllTickets as jest.Mock).mockRejectedValue(new Error("boom"));

      await ticketController.getTickets(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getTicket", () => {
    it("should return a ticket when found", async () => {
      const ticket: Ticket = {
        id: 1,
        title: "One",
        description: "Desc",
        priority: "medium",
        status: "open",
        createdAt: new Date().toISOString(),
      };

      mockReq.params = { id: "1" };
      (ticketService.getTicketById as jest.Mock).mockResolvedValue(ticket);

      await ticketController.getTicket(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket retrieved successfully",
        data: ticket,
      });
    });

    it("should return 404 when ticket not found", async () => {
      mockReq.params = { id: "999" };
      (ticketService.getTicketById as jest.Mock).mockResolvedValue(undefined);

      await ticketController.getTicket(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Ticket not found" });
    });
  });

  describe("postTicket", () => {
    it("should handle successful creation", async () => {
      const mockBody = {
        title: "New",
        description: "New desc",
        priority: "low" as const,
      };

      const created: Ticket = {
        id: 10,
        title: mockBody.title,
        description: mockBody.description,
        priority: mockBody.priority, // stays TicketPriority
        status: "open",
        createdAt: new Date().toISOString(),
      };

      mockReq.body = mockBody;

      (ticketService.createTicket as jest.Mock).mockResolvedValue(created);

      await ticketController.postTicket(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket created successfully",
        data: created,
      });
    });

    it("should return 400 when title is missing", async () => {
      mockReq.body = { description: "x", priority: "low" as const };

      await ticketController.postTicket(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Missing required field: title" });
    });

    it("should return 400 when description is missing", async () => {
      mockReq.body = { title: "x", priority: "low" as const };

      await ticketController.postTicket(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Missing required field: description" });
    });
  });

  describe("putTicket", () => {
    it("should handle successful update", async () => {
      const updated: Ticket = {
        id: 1,
        title: "A",
        description: "B",
        priority: "high",
        status: "in-progress",
        createdAt: new Date().toISOString(),
      };

      mockReq.params = { id: "1" };
      mockReq.body = { status: "in-progress" as const };

      (ticketService.updateTicket as jest.Mock).mockResolvedValue(updated);

      await ticketController.putTicket(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket updated successfully",
        data: updated,
      });
    });

    it("should return 404 when ticket not found", async () => {
      mockReq.params = { id: "999" };
      (ticketService.updateTicket as jest.Mock).mockRejectedValue(new Error("Ticket not found"));

      await ticketController.putTicket(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Ticket not found" });
    });
  });

  describe("removeTicket", () => {
    it("should handle successful delete", async () => {
      mockReq.params = { id: "1" };

      (ticketService.deleteTicket as jest.Mock).mockResolvedValue({
        id: 1,
        title: "A",
        description: "B",
        priority: "low",
        status: "open",
        createdAt: new Date().toISOString(),
      } as Ticket);

      await ticketController.removeTicket(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket deleted successfully",
      });
    });

    it("should return 404 when ticket not found", async () => {
      mockReq.params = { id: "999" };
      (ticketService.deleteTicket as jest.Mock).mockRejectedValue(new Error("Ticket not found"));

      await ticketController.removeTicket(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Ticket not found" });
    });
  });

  describe("getTicketUrgency", () => {
    it("should return urgency data when ticket exists", async () => {
      const ticket: Ticket = {
        id: 1,
        title: "A",
        description: "B",
        priority: "critical",
        status: "open",
        createdAt: new Date().toISOString(),
      };

      mockReq.params = { id: "1" };

      (ticketService.getTicketById as jest.Mock).mockResolvedValue(ticket);
      (ticketService.calculateUrgency as jest.Mock).mockResolvedValue({
        urgencyScore: 50,
        urgencyLevel: "HIGH",
        message: "HIGH urgency",
        ageDays: 0,
      });

      await ticketController.getTicketUrgency(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket urgency calculated successfully",
        data: {
          ...ticket,
          urgency: {
            urgencyScore: 50,
            urgencyLevel: "HIGH",
            message: "HIGH urgency",
            ageDays: 0,
          },
        },
      });
    });

    it("should return 404 when ticket not found", async () => {
      mockReq.params = { id: "999" };
      (ticketService.getTicketById as jest.Mock).mockResolvedValue(undefined);

      await ticketController.getTicketUrgency(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Ticket not found" });
    });
  });
});
