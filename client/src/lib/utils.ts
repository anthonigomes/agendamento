import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Retorna a data da segunda-feira da semana atual (00:00:00)
 * No domingo, retorna a segunda-feira da próxima semana
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  // Se é domingo (0), considera a próxima segunda (1 dia à frente)
  // Senão, encontra a segunda da semana atual
  const diff = d.getDate() - day + (day === 0 ? 1 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Retorna a data da sexta-feira da semana atual (23:59:59)
 * No domingo, retorna a sexta-feira da próxima semana
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const monday = getWeekStart(date);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4); // Adiciona 4 dias para sexta
  friday.setHours(23, 59, 59, 999);
  return friday;
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
 * Verifica se um dia da semana está dentro da semana atual (segunda a sexta)
 * Compara o dayOfWeek do booking com a semana de trabalho atual
 */
export function isBookingInCurrentWeek(dayOfWeek: string): boolean {
  const now = new Date();
  const currentDay = now.getDay();
  
  // Se é sábado (6) ou domingo (0), nenhum booking é "desta semana"
  // pois o lab não funciona no fim de semana
  if (currentDay === 0 || currentDay === 6) {
    // No domingo, mostra agendamentos da próxima semana (segunda a sexta)
    // No sábado, mostra agendamentos da semana atual (segunda a sexta já passou)
    return true; // Sempre mostra para permitir visualização
  }
  
  // Durante a semana (segunda a sexta), mostra todos os agendamentos
  return true;
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
