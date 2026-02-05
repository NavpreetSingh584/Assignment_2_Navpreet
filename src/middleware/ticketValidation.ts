import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import type { TicketPriority, TicketStatus } from "../data/tickets";

const PRIORITIES: TicketPriority[] = ["critical", "high", "medium", "low"];
const STATUSES: TicketStatus[] = ["open", "in-progress", "resolved"];

export function validateCreateTicket(req: Request, res: Response, next: NextFunction): void {
  const { title, description, priority } = req.body ?? {};

  if (!title) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Missing required field: title" });
    return;
  }
  if (!description) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Missing required field: description" });
    return;
  }
  if (!priority || !PRIORITIES.includes(priority)) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Invalid priority. Must be one of: critical, high, medium, low" });
    return;
  }

  next();
}

export function validateUpdateTicket(req: Request, res: Response, next: NextFunction): void {
  const { priority, status } = req.body ?? {};

  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Invalid priority. Must be one of: critical, high, medium, low" });
    return;
  }

  if (status !== undefined && !STATUSES.includes(status)) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Invalid status. Must be one of: open, in-progress, resolved" });
    return;
  }

  next();
}
