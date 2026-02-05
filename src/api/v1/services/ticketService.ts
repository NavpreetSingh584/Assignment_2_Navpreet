import type { Ticket, TicketPriority, TicketStatus } from "../../../data/tickets";
import { getTicketsStore, setTicketsStore } from "../../../data/tickets";

/**
 * Service-layer types (inputs + urgency output)
 */
export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
}

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "RESOLVED";

export interface UrgencyResult {
  urgencyScore: number;
  urgencyLevel: UrgencyLevel;
  message: string;
  ageDays: number;
}

/**
 * Retrieves all tickets from storage
 * @returns Array of all tickets
 */
export const getAllTickets = async (): Promise<Ticket[]> => {
  // return a safe copy (like your items example)
  return structuredClone(getTicketsStore());
};

/**
 * Retrieves a single ticket by ID
 * @param id - The ticket ID
 * @returns The ticket, or undefined if not found
 */
export const getTicketById = async (id: number): Promise<Ticket | undefined> => {
  const ticket = getTicketsStore().find((t: Ticket) => t.id === id);
  return ticket ? structuredClone(ticket) : undefined;
};

/**
 * Creates a new ticket
 * @param ticketData - Required fields for ticket creation
 * @returns The created ticket with generated ID
 */
export const createTicket = async (ticketData: CreateTicketInput): Promise<Ticket> => {
  const tickets: Ticket[] = getTicketsStore();

  const maxId: number = tickets.reduce((m: number, t: Ticket) => Math.max(m, t.id), 0);

  const newTicket: Ticket = {
    id: maxId + 1,
    title: ticketData.title,
    description: ticketData.description,
    priority: ticketData.priority,
    status: "open",
    createdAt: new Date().toISOString(),
  };

  setTicketsStore([...tickets, newTicket]);

  return structuredClone(newTicket);
};

/**
 * Updates (partially) an existing ticket
 * @param id - The ID of the ticket to update
 * @param ticketData - Fields to update
 * @returns The updated ticket
 * @throws Error if ticket with given ID is not found
 */
export const updateTicket = async (id: number, ticketData: UpdateTicketInput): Promise<Ticket> => {
  const tickets: Ticket[] = getTicketsStore();
  const index: number = tickets.findIndex((t: Ticket) => t.id === id);

  if (index === -1) {
    throw new Error("Ticket not found");
  }

  tickets[index] = {
    ...tickets[index],
    ...ticketData,
  };

  setTicketsStore([...tickets]);

  return structuredClone(tickets[index]);
};

/**
 * Deletes a ticket from storage
 * @param id - The ID of the ticket to delete
 * @returns The deleted ticket (useful for responses)
 * @throws Error if ticket with given ID is not found
 */
export const deleteTicket = async (id: number): Promise<Ticket> => {
  const tickets: Ticket[] = getTicketsStore();
  const index: number = tickets.findIndex((t: Ticket) => t.id === id);

  if (index === -1) {
    throw new Error("Ticket not found");
  }

  const removed: Ticket = tickets[index];
  const remaining: Ticket[] = tickets.filter((t: Ticket) => t.id !== id);

  setTicketsStore(remaining);

  return structuredClone(removed);
};

/**
 * Urgency Calculation
 * Base scores (given):
 * critical 50, high 30, medium 20, low 10
 *
 * Age multiplier + thresholds MUST match your video demo.
 * These defaults are placeholders you can adjust after watching the demo.
 */
export const calculateUrgency = async (ticket: Ticket, now: Date = new Date()): Promise<UrgencyResult> => {
  if (ticket.status === "resolved") {
    return {
      urgencyScore: 0,
      urgencyLevel: "RESOLVED",
      message: "Ticket is resolved",
      ageDays: 0,
    };
  }

  const baseScores: Record<TicketPriority, number> = {
    critical: 50,
    high: 30,
    medium: 20,
    low: 10,
  };

  const createdAt: Date = new Date(ticket.createdAt);
  const msPerDay: number = 1000 * 60 * 60 * 24;
  const ageDays: number = Math.max(0, Math.floor((now.getTime() - createdAt.getTime()) / msPerDay));

  // Placeholder: change to match your demo
  const AGE_MULTIPLIER: number = 2;
  const urgencyScore: number = baseScores[ticket.priority] + ageDays * AGE_MULTIPLIER;

  // Placeholder thresholds/messages: change to match your demo
  if (urgencyScore >= 80) {
    return { urgencyScore, urgencyLevel: "CRITICAL", message: "CRITICAL urgency", ageDays };
  }
  if (urgencyScore >= 60) {
    return { urgencyScore, urgencyLevel: "HIGH", message: "HIGH urgency", ageDays };
  }
  if (urgencyScore >= 40) {
    return { urgencyScore, urgencyLevel: "MEDIUM", message: "MEDIUM urgency", ageDays };
  }

  return { urgencyScore, urgencyLevel: "LOW", message: "LOW urgency", ageDays };
};
