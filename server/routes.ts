import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      const allBookings = await storage.getBookings();
      
      const parseTime = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const newStartMinutes = parseTime(validatedData.startTime);
      const newDuration = parseInt(validatedData.duration);
      const newEndMinutes = newStartMinutes + (newDuration * 50);
      
      const conflict = allBookings.find((b) => {
        if (b.shift !== validatedData.shift || b.dayOfWeek !== validatedData.dayOfWeek) {
          return false;
        }
        
        const existingStartMinutes = parseTime(b.startTime);
        const existingDuration = parseInt(b.duration);
        const existingEndMinutes = existingStartMinutes + (existingDuration * 50);
        
        return (
          (newStartMinutes >= existingStartMinutes && newStartMinutes < existingEndMinutes) ||
          (newEndMinutes > existingStartMinutes && newEndMinutes <= existingEndMinutes) ||
          (newStartMinutes <= existingStartMinutes && newEndMinutes >= existingEndMinutes)
        );
      });

      if (conflict) {
        return res.status(400).json({
          message: "Já existe um agendamento que conflita com este horário",
          conflict,
        });
      }

      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: validationError.message,
        });
      }
      
      console.error("Error creating booking:", error);
      res.status(500).json({
        message: error.message || "Erro ao criar agendamento",
      });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const { shift } = req.query;
      
      let bookings;
      if (shift && typeof shift === "string") {
        bookings = await storage.getBookingsByShift(shift);
      } else {
        bookings = await storage.getBookings();
      }
      
      res.json(bookings);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({
        message: error.message || "Erro ao buscar agendamentos",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
