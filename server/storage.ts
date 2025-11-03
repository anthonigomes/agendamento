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
  updateBooking(id: string, booking: InsertBooking): Promise<Booking | null>;
  deleteBooking(id: string): Promise<boolean>;
}

export class GoogleSheetsStorage implements IStorage {
  private users: Map<string, User>;
  private spreadsheetId: string | null = null;

  constructor() {
    this.users = new Map();
    this.spreadsheetId = process.env[SPREADSHEET_ID_KEY]?.trim() || null;
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
                { userEnteredValue: { stringValue: 'Email' } },
                { userEnteredValue: { stringValue: 'Telefone' } },
                { userEnteredValue: { stringValue: 'Disciplina' } },
                { userEnteredValue: { stringValue: 'Turno' } },
                { userEnteredValue: { stringValue: 'Dia da Semana' } },
                { userEnteredValue: { stringValue: 'Horário' } },
                { userEnteredValue: { stringValue: 'Duração (aulas)' } },
                { userEnteredValue: { stringValue: 'Objetivo da Aula' } },
                { userEnteredValue: { stringValue: 'Recursos' } },
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
      range: 'Agendamentos!A:M',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          booking.id,
          booking.professorName,
          booking.professorEmail,
          booking.professorPhone,
          booking.subject,
          booking.shift,
          booking.dayOfWeek,
          booking.startTime,
          booking.duration,
          booking.objective,
          booking.resources.join(', '),
          booking.notes || '',
          booking.createdAt?.toISOString() || new Date().toISOString(),
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
        range: 'Agendamentos!A2:M',
      });

      const rows = response.data.values || [];
      
      return rows.map(row => ({
        id: row[0],
        professorName: row[1],
        professorEmail: row[2],
        professorPhone: row[3],
        subject: row[4],
        shift: row[5],
        dayOfWeek: row[6],
        startTime: row[7],
        duration: row[8],
        objective: row[9],
        resources: row[10] ? row[10].split(', ') : [],
        notes: row[11] || null,
        createdAt: row[12] ? new Date(row[12]) : null,
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

  async updateBooking(id: string, insertBooking: InsertBooking): Promise<Booking | null> {
    try {
      const spreadsheetId = await this.ensureSpreadsheet();
      const sheets = await getUncachableGoogleSheetClient();
      
      // Get all rows to find the one to update
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Agendamentos!A2:M',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        return null; // Booking not found
      }

      // Actual row number in sheet (header is row 1, data starts at row 2)
      const sheetRowNumber = rowIndex + 2;
      
      const booking: Booking = {
        ...insertBooking,
        id,
        createdAt: rows[rowIndex][12] ? new Date(rows[rowIndex][12]) : new Date(),
        notes: insertBooking.notes || null,
      };

      // Update the row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Agendamentos!A${sheetRowNumber}:M${sheetRowNumber}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            booking.id,
            booking.professorName,
            booking.professorEmail,
            booking.professorPhone,
            booking.subject,
            booking.shift,
            booking.dayOfWeek,
            booking.startTime,
            booking.duration,
            booking.objective,
            booking.resources.join(', '),
            booking.notes || '',
            booking.createdAt?.toISOString() || new Date().toISOString(),
          ]]
        }
      });

      return booking;
    } catch (error) {
      console.error('Error updating booking:', error);
      return null;
    }
  }

  async deleteBooking(id: string): Promise<boolean> {
    try {
      const spreadsheetId = await this.ensureSpreadsheet();
      const sheets = await getUncachableGoogleSheetClient();
      
      // Get all rows to find the one to delete
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Agendamentos!A2:M',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        return false; // Booking not found
      }

      // Actual row number in sheet (header is row 1, data starts at row 2)
      const sheetRowNumber = rowIndex + 2;
      
      // Get the sheet ID
      const spreadsheetData = await sheets.spreadsheets.get({
        spreadsheetId,
      });
      
      const sheet = spreadsheetData.data.sheets?.[0];
      if (!sheet?.properties?.sheetId) {
        return false;
      }

      // Delete the row
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: sheet.properties.sheetId,
                dimension: 'ROWS',
                startIndex: sheetRowNumber - 1, // 0-indexed
                endIndex: sheetRowNumber, // exclusive
              }
            }
          }]
        }
      });

      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      return false;
    }
  }
}

export const storage = new GoogleSheetsStorage();
