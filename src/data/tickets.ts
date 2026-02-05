// Import Ticket interface from the service layer
// This ensures our sample data follows the correct structure
import { Ticket } from "../api/v1/services/ticketService";

/**
 * Helper function to generate ISO timestamps
 * based on how many days ago the ticket was created.
 * This avoids using static dates.
 */
function daysAgo(days: number): string {
    return new Date(
        Date.now() - days * 24 * 60 * 60 * 1000
    ).toISOString();
}

/**
 * Sample support ticket data
 * This data is loaded into memory when the server starts.
 */
export const sampleTickets: Ticket[] = [
    {
        id: 1,
        title: "Update footer copyright year",
        description: "Footer still shows 2024",
        priority: "low",
        status: "open",
        createdAt: daysAgo(3)
    },
    {
        id: 2,
        title: "Profile picture upload slow",
        description: "Upload takes 30+ seconds",
        priority: "medium",
        status: "open",
        createdAt: daysAgo(2)
    },
    {
        id: 3,
        title: "Dashboard loading slowly",
        description: "Dashboard takes 10+ seconds to load",
        priority: "medium",
        status: "open",
        createdAt: daysAgo(6)
    },
    {
        id: 4,
        title: "Password reset email delayed",
        description: "Reset emails taking over 30 minutes",
        priority: "high",
        status: "open",
        createdAt: daysAgo(5)
    },
    {
        id: 5,
        title: "Export to PDF not working",
        description: "PDF export fails silently",
        priority: "high",
        status: "open",
        createdAt: daysAgo(9)
    },
    {
        id: 6,
        title: "Login page not loading",
        description: "Users report blank screen on login",
        priority: "critical",
        status: "open",
        createdAt: daysAgo(6)
    },
    {
        id: 7,
        title: "Dark mode toggle broken",
        description: "Dark mode doesn't persist after refresh",
        priority: "medium",
        status: "resolved",
        createdAt: daysAgo(10)
    }
];
