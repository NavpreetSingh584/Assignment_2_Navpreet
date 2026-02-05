import { Router } from "express";
import ticketRoutes from "./routes/ticketRoutes";

const router = Router();

router.use("/tickets", ticketRoutes);

export default router;
