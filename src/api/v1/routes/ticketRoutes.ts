import express, { Router } from "express";
import { getTickets, getTicket, postTicket, putTicket, removeTicket, getTicketUrgency,} from "../controllers/ticketController";
import { validateCreateTicket, validateUpdateTicket} from "../../../middleware/ticketValidation";

const router: Router = express.Router();

// "/api/v1/tickets" prefixes all below routes

router.get("/", getTickets);
router.get("/:id", getTicket);
router.get("/:id/urgency", getTicketUrgency);

router.post("/", validateCreateTicket, postTicket);
router.put("/:id", validateUpdateTicket, putTicket);
router.delete("/:id", removeTicket);

export default router;
