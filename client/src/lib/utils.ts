import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Retorna a data da segunda-feira da semana para uma data específica
 * Se for domingo, considera a próxima segunda-feira
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  // Se é domingo (0), avança para a próxima segunda
  // Senão, volta para a segunda da semana atual
  const diff = day === 0 ? 1 : -(day - 1);
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Retorna a data da sexta-feira da semana para uma data específica
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const monday = getWeekStart(date);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4); // Adiciona 4 dias para sexta
  friday.setHours(23, 59, 59, 999);
  return friday;
}

/**
 * Formata uma data para string no formato YYYY-MM-DD
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gera as próximas N semanas a partir da semana atual
 */
export function getNextWeeks(count: number = 4): Array<{ startDate: string, label: string }> {
  const weeks = [];
  let currentMonday = getWeekStart();
  
  for (let i = 0; i < count; i++) {
    const friday = new Date(currentMonday);
    friday.setDate(currentMonday.getDate() + 4);
    
    const startStr = formatDateToString(currentMonday);
    const label = `${currentMonday.getDate().toString().padStart(2, '0')}/${(currentMonday.getMonth() + 1).toString().padStart(2, '0')} a ${friday.getDate().toString().padStart(2, '0')}/${(friday.getMonth() + 1).toString().padStart(2, '0')}`;
    
    weeks.push({ startDate: startStr, label });
    
    // Próxima segunda
    currentMonday = new Date(currentMonday);
    currentMonday.setDate(currentMonday.getDate() + 7);
  }
  
  return weeks;
}

/**
 * Retorna o primeiro dia do mês atual (00:00:00)
 */
export function getMonthStart(date: Date = new Date()): Date {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Retorna o último dia do mês atual (23:59:59)
 */
export function getMonthEnd(date: Date = new Date()): Date {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Verifica se um booking pertence à semana atual
 */
export function isBookingInCurrentWeek(weekStartDate: string): boolean {
  const currentWeekStart = formatDateToString(getWeekStart());
  return weekStartDate === currentWeekStart;
}

/**
 * Verifica se uma data está dentro do mês atual
 */
export function isCurrentMonth(date: Date | string | null): boolean {
  if (!date) return false;
  const d = new Date(date);
  const monthStart = getMonthStart();
  const monthEnd = getMonthEnd();
  return d >= monthStart && d <= monthEnd;
}
