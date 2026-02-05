import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { calculateUrgency, createTicket, deleteTicket, getAllTickets, getTicketById, updateTicket,} from "../services/ticketService";
import type { Ticket } from "../../../data/tickets";

/**
 * Manages requests and responses to retrieve all Tickets
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */                 


export const getTickets = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tickets: Ticket[] = await getAllTickets();

    res.status(HTTP_STATUS.OK).json({
      message: "Tickets retrieved successfully",
      data: tickets,
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Manages requests and responses to retrieve a Ticket by ID
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id: number = Number(req.params.id);
    const ticket: Ticket | undefined = await getTicketById(id);

    if (!ticket) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Ticket retrieved successfully",
      data: ticket,
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Manages requests, responses, and validation to create a Ticket
 * Validation messages MUST match assignment requirements.
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const postTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, priority } = req.body ?? {};

    // Validation rules (exact messages)
    if (!title) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Missing required field: title" });
      return;
    }
    if (!description) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Missing required field: description" });
      return;
    }

    // priority validity should already be handled by middleware, but keeping safe check here is fine
    const created: Ticket = await createTicket({ title, description, priority });

    res.status(HTTP_STATUS.CREATED).json({
      message: "Ticket created successfully",
      data: created,
    });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Manages requests and responses to update a Ticket
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const putTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id: number = Number(req.params.id);

    // validation for priority/status is handled by middleware
    const updated: Ticket = await updateTicket(id, req.body);

    res.status(HTTP_STATUS.OK).json({
      message: "Ticket updated successfully",
      data: updated,
    });
  } catch (error: unknown) {
    // service throws "Ticket not found"
    res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
    // or: next(error); if you want global handler
  }
};

/**
 * Manages requests and responses to delete a Ticket
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const removeTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id: number = Number(req.params.id);

    await deleteTicket(id);

    res.status(HTTP_STATUS.OK).json({
      message: "Ticket deleted successfully",
    });
  } catch (error: unknown) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
    // or: next(error);
  }
};

/**
 * Special endpoint - returns ticket with its calculated urgency info
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getTicketUrgency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id: number = Number(req.params.id);
    const ticket: Ticket | undefined = await getTicketById(id);

    if (!ticket) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
      return;
    }

    const urgency = await calculateUrgency(ticket);

    res.status(HTTP_STATUS.OK).json({
      message: "Ticket urgency calculated successfully",
      data: {
        ...ticket,
        urgency,
      },
    });
  } catch (error: unknown) {
    next(error);
  }
};
