import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Booking } from "@shared/schema";
import { User, BookOpen } from "lucide-react";

interface WeeklyScheduleProps {
  shift: "manha" | "tarde" | "noite";
  bookings: Booking[];
  isLoading: boolean;
}

const daysOfWeek = [
  { value: "segunda", label: "Seg" },
  { value: "terca", label: "Ter" },
  { value: "quarta", label: "Qua" },
  { value: "quinta", label: "Qui" },
  { value: "sexta", label: "Sex" },
];

const timeSlots = {
  manha: ["07:30", "08:20", "09:10", "10:00"],
  tarde: ["13:00", "14:00", "15:15", "16:15"],
  noite: ["18:50", "19:40", "20:45", "21:35"],
};

export function WeeklySchedule({ shift, bookings, isLoading }: WeeklyScheduleProps) {
  const slots = timeSlots[shift];

  const getBookingForSlot = (day: string, time: string) => {
    // Check if there's a booking that starts at this time
    const directBooking = bookings.find(
      (booking) =>
        booking.shift === shift &&
        booking.dayOfWeek === day &&
        booking.startTime === time
    );
    
    if (directBooking) {
      return directBooking;
    }
    
    // Check if there's a booking with 2 classes that started in the previous slot
    const currentSlotIndex = slots.indexOf(time);
    if (currentSlotIndex > 0) {
      const previousTime = slots[currentSlotIndex - 1];
      const previousBooking = bookings.find(
        (booking) =>
          booking.shift === shift &&
          booking.dayOfWeek === day &&
          booking.startTime === previousTime &&
          booking.duration === "2"
      );
      
      if (previousBooking) {
        return previousBooking;
      }
    }
    
    return undefined;
  };

  if (isLoading) {
    return (
      <Card className="p-4" data-testid="loading-schedule">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" data-testid={`skeleton-row-${i}`} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto" data-testid="schedule-grid">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-lg border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-muted/50 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium"
                  data-testid="header-time"
                >
                  Horário
                </th>
                {daysOfWeek.map((day) => (
                  <th
                    key={day.value}
                    scope="col"
                    className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium"
                    data-testid={`header-${day.value}`}
                  >
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {slots.map((time) => (
                <tr key={time} className="hover-elevate" data-testid={`row-${time}`}>
                  <td className="sticky left-0 z-10 bg-card whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium" data-testid={`time-${time}`}>
                    {time}
                  </td>
                  {daysOfWeek.map((day) => {
                    const booking = getBookingForSlot(day.value, time);
                    return (
                      <td
                        key={`${day.value}-${time}`}
                        className="px-1 sm:px-2 py-1 sm:py-2"
                        data-testid={`cell-${day.value}-${time}`}
                      >
                        {booking ? (
                          <div className="rounded-md border border-primary/20 bg-primary/5 p-2 sm:p-3 min-h-[70px] sm:min-h-[80px] space-y-1 sm:space-y-2" data-testid={`booking-${day.value}-${time}`}>
                            <div className="flex items-start justify-between gap-1 sm:gap-2">
                              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium min-w-0">
                                <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" data-testid="icon-professor" />
                                <span className="line-clamp-1 truncate" data-testid="text-professor-name">{booking.professorName}</span>
                              </div>
                              <Badge variant="secondary" className="text-[10px] sm:text-xs flex-shrink-0 px-1 sm:px-2" data-testid="badge-duration">
                                {booking.duration === "1" ? "1" : "2"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground min-w-0">
                              <BookOpen className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" data-testid="icon-subject" />
                              <span className="line-clamp-1 truncate" data-testid="text-subject">{booking.subject}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-md border border-dashed border-border/50 bg-muted/20 p-2 sm:p-3 min-h-[70px] sm:min-h-[80px] flex items-center justify-center" data-testid={`available-${day.value}-${time}`}>
                            <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline" data-testid="text-available">
                              Disponível
                            </span>
                            <span className="text-[10px] text-muted-foreground sm:hidden">-</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
