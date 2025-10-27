import { type User, type InsertUser, type Booking, type InsertBooking } from "@shared/schema";
import { randomUUID } from "crypto";
import { getUncachableGoogleSheetClient } from "./google-sheets";

const SPREADSHEET_ID_KEY = "LAB_BOOKING_SPREADSHEET_ID";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookings(): Promise<Booking[]>;
  getBookingsByShift(shift: string): Promise<Booking[]>;
}

export class GoogleSheetsStorage implements IStorage {
  private users: Map<string, User>;
  private spreadsheetId: string | null = null;

  constructor() {
    this.users = new Map();
    this.spreadsheetId = process.env[SPREADSHEET_ID_KEY] || null;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  private async ensureSpreadsheet(): Promise<string> {
    if (this.spreadsheetId) {
      return this.spreadsheetId;
    }

    const sheets = await getUncachableGoogleSheetClient();
    
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'Agendamentos - Laboratório de Informática',
        },
        sheets: [{
          properties: {
            title: 'Agendamentos',
          },
          data: [{
            rowData: [{
              values: [
                { userEnteredValue: { stringValue: 'ID' } },
                { userEnteredValue: { stringValue: 'Professor' } },
                { userEnteredValue: { stringValue: 'Disciplina' } },
                { userEnteredValue: { stringValue: 'Turno' } },
                { userEnteredValue: { stringValue: 'Dia da Semana' } },
                { userEnteredValue: { stringValue: 'Horário' } },
                { userEnteredValue: { stringValue: 'Duração (aulas)' } },
                { userEnteredValue: { stringValue: 'Observações' } },
                { userEnteredValue: { stringValue: 'Data de Criação' } },
              ]
            }]
          }]
        }]
      }
    });

    this.spreadsheetId = spreadsheet.data.spreadsheetId!;
    console.log(`Created spreadsheet with ID: ${this.spreadsheetId}`);
    console.log(`Spreadsheet URL: https://docs.google.com/spreadsheets/d/${this.spreadsheetId}`);
    
    return this.spreadsheetId;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const spreadsheetId = await this.ensureSpreadsheet();
    const sheets = await getUncachableGoogleSheetClient();
    
    const id = randomUUID();
    const createdAt = new Date();
    
    const booking: Booking = {
      ...insertBooking,
      id,
      createdAt,
      notes: insertBooking.notes || null,
    };

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Agendamentos!A:I',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          booking.id,
          booking.professorName,
          booking.subject,
          booking.shift,
          booking.dayOfWeek,
          booking.startTime,
          booking.duration,
          booking.notes || '',
          booking.createdAt.toISOString(),
        ]]
      }
    });

    return booking;
  }

  async getBookings(): Promise<Booking[]> {
    try {
      const spreadsheetId = await this.ensureSpreadsheet();
      const sheets = await getUncachableGoogleSheetClient();
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Agendamentos!A2:I',
      });

      const rows = response.data.values || [];
      
      return rows.map(row => ({
        id: row[0],
        professorName: row[1],
        subject: row[2],
        shift: row[3],
        dayOfWeek: row[4],
        startTime: row[5],
        duration: row[6],
        notes: row[7] || null,
        createdAt: row[8] ? new Date(row[8]) : null,
      }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  }

  async getBookingsByShift(shift: string): Promise<Booking[]> {
    const allBookings = await this.getBookings();
    return allBookings.filter(booking => booking.shift === shift);
  }
}

export const storage = new GoogleSheetsStorage();
