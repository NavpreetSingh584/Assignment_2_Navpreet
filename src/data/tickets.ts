export type TicketPriority = "critical" | "high" | "medium" | "low";
export type TicketStatus = "open" | "in-progress" | "resolved";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string; // ISO string
}

// Helper to create dates relative to now (so results don't go stale)
function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

// Initial sample data (similar to the table, but relative dates)
const seedTickets: Ticket[] = [
  { id: 1, title: "Update footer copyright year", description: "Footer still shows 2024", priority: "low", status: "open", createdAt: daysAgo(3) },
  { id: 2, title: "Profile picture upload slow", description: "Upload takes 30+ seconds", priority: "medium", status: "open", createdAt: daysAgo(2) },
  { id: 3, title: "Dashboard loading slowly", description: "Dashboard takes 10+ seconds to load", priority: "medium", status: "open", createdAt: daysAgo(6) },
  { id: 4, title: "Password reset email delayed", description: "Reset emails taking over 30 minutes", priority: "high", status: "open", createdAt: daysAgo(5) },
  { id: 5, title: "Export to PDF not working", description: "PDF export fails silently", priority: "high", status: "open", createdAt: daysAgo(9) },
  { id: 6, title: "Login page not loading", description: "Users report blank screen on login", priority: "critical", status: "open", createdAt: daysAgo(6) },
  { id: 7, title: "Dark mode toggle broken", description: "Dark mode doesn't persist after refresh", priority: "medium", status: "resolved", createdAt: daysAgo(10) },
];

let tickets: Ticket[] = [...seedTickets];

export function getTicketsStore(): Ticket[] {
  return tickets;
}

export function setTicketsStore(next: Ticket[]): void {
  tickets = next;
}

export function resetTicketsStore(): void {
  tickets = [...seedTickets];
}
