import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Agendamentos do laboratório de informática
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  professorName: text("professor_name").notNull(),
  professorEmail: text("professor_email").notNull(),
  professorPhone: text("professor_phone").notNull(),
  subject: text("subject").notNull(),
  shift: text("shift").notNull(), // "manha", "tarde", "noite"
  dayOfWeek: text("day_of_week").notNull(), // "segunda", "terca", "quarta", "quinta", "sexta"
  startTime: text("start_time").notNull(), // "08:00", "09:00", etc
  duration: text("duration").notNull(), // "1" or "2" (number of classes)
  objective: text("objective").notNull(), // Objetivo da aula
  resources: text("resources").array().notNull(), // Recursos: Internet, Projetor, Livro, etc
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
}).extend({
  professorName: z.string().min(1, "Nome do professor é obrigatório"),
  professorEmail: z.string().email("Email inválido"),
  professorPhone: z.string().min(10, "Telefone inválido").regex(/^[\d\s\(\)\-]+$/, "Telefone deve conter apenas números"),
  subject: z.string().min(1, "Disciplina é obrigatória"),
  shift: z.enum(["manha", "tarde", "noite"], {
    required_error: "Selecione um turno",
  }),
  dayOfWeek: z.enum(["segunda", "terca", "quarta", "quinta", "sexta"], {
    required_error: "Selecione um dia da semana",
  }),
  startTime: z.string().min(1, "Horário de início é obrigatório"),
  duration: z.enum(["1", "2"], {
    required_error: "Selecione a duração",
  }),
  objective: z.string().min(1, "Objetivo da aula é obrigatório"),
  resources: z.array(z.string()).min(1, "Selecione pelo menos um recurso"),
  notes: z.string().optional(),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Keep existing user schema for template compatibility
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
