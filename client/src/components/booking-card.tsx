import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, Calendar, Clock, Target, Wifi, Projector, Book, Tablet, MoreHorizontal } from "lucide-react";
import type { Booking } from "@shared/schema";

const resourceIcons: Record<string, React.ComponentType<any>> = {
  internet: Wifi,
  projetor: Projector,
  livros: Book,
  tablet: Tablet,
  computadores: User,
  outros: MoreHorizontal,
};

const resourceLabels: Record<string, string> = {
  internet: "Internet",
  projetor: "Projetor",
  computadores: "Computadores",
  livros: "Livros",
  tablet: "Tablets",
  outros: "Outros",
};

interface BookingCardProps {
  booking: Booking;
  compact?: boolean;
}

const dayLabels: Record<string, string> = {
  segunda: "Segunda",
  terca: "Terça",
  quarta: "Quarta",
  quinta: "Quinta",
  sexta: "Sexta",
};

const shiftLabels: Record<string, string> = {
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
};

export function BookingCard({ booking, compact = false }: BookingCardProps) {
  if (compact) {
    return (
      <div className="space-y-2 border-l-2 border-primary/30 pl-3" data-testid={`compact-booking-${booking.id}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium leading-none" data-testid="text-professor-compact">{booking.professorName}</p>
            <p className="text-xs text-muted-foreground mt-1" data-testid="text-subject-compact">{booking.subject}</p>
          </div>
          <Badge variant="secondary" className="text-xs" data-testid="badge-duration-compact">
            {booking.duration === "1" ? "1 aula" : "2 aulas"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground" data-testid="text-schedule-compact">
          {dayLabels[booking.dayOfWeek]} • {booking.startTime}
        </p>
      </div>
    );
  }

  return (
    <Card className="hover-elevate" data-testid={`card-booking-${booking.id}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" data-testid="icon-user-card" />
              <h3 className="font-medium truncate" data-testid="text-professor-card">{booking.professorName}</h3>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" data-testid="icon-book-card" />
              <p className="text-sm text-muted-foreground truncate" data-testid="text-subject-card">
                {booking.subject}
              </p>
            </div>
          </div>
          <Badge variant="secondary" data-testid="badge-duration-card">
            {booking.duration === "1" ? "1 aula" : "2 aulas"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" data-testid="icon-calendar-card" />
            <span className="text-muted-foreground" data-testid="text-day-card">
              {dayLabels[booking.dayOfWeek]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" data-testid="icon-clock-card" />
            <span className="text-muted-foreground" data-testid="text-time-card">
              {shiftLabels[booking.shift]} • {booking.startTime}
            </span>
          </div>
        </div>

        {booking.objective && (
          <div className="space-y-2 border-t pt-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" data-testid="icon-objective-card" />
              <span className="text-sm font-medium">Objetivo</span>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-objective-card">
              {booking.objective}
            </p>
          </div>
        )}

        {booking.resources && booking.resources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {booking.resources.map((resource) => {
              const Icon = resourceIcons[resource] || MoreHorizontal;
              return (
                <Badge key={resource} variant="outline" className="gap-1" data-testid={`badge-resource-${resource}`}>
                  <Icon className="h-3 w-3" />
                  <span>{resourceLabels[resource] || resource}</span>
                </Badge>
              );
            })}
          </div>
        )}

        {booking.notes && (
          <p className="text-sm text-muted-foreground border-t pt-3" data-testid="text-notes-card">
            {booking.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
