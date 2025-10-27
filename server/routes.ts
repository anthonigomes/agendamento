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

  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Check for conflicts with other bookings (excluding the current one)
      const allBookings = await storage.getBookings();
      
      const parseTime = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const newStartMinutes = parseTime(validatedData.startTime);
      const newDuration = parseInt(validatedData.duration);
      const newEndMinutes = newStartMinutes + (newDuration * 50);
      
      const conflict = allBookings.find((b) => {
        // Skip the booking being updated
        if (b.id === id) {
          return false;
        }
        
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

      const updatedBooking = await storage.updateBooking(id, validatedData);
      
      if (!updatedBooking) {
        return res.status(404).json({
          message: "Agendamento não encontrado",
        });
      }
      
      res.json(updatedBooking);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: validationError.message,
        });
      }
      
      console.error("Error updating booking:", error);
      res.status(500).json({
        message: error.message || "Erro ao atualizar agendamento",
      });
    }
  });

  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBooking(id);
      
      if (!deleted) {
        return res.status(404).json({
          message: "Agendamento não encontrado",
        });
      }
      
      res.json({ message: "Agendamento excluído com sucesso" });
    } catch (error: any) {
      console.error("Error deleting booking:", error);
      res.status(500).json({
        message: error.message || "Erro ao excluir agendamento",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
