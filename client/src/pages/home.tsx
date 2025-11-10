import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, BookOpen, User, Plus, Settings } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingForm } from "@/components/booking-form";
import { WeeklySchedule } from "@/components/weekly-schedule";
import { BookingCard } from "@/components/booking-card";
import type { Booking } from "@shared/schema";
import { isBookingInCurrentWeek, getWeekStart, getWeekEnd, formatDateToString } from "@/lib/utils";

type Shift = "manha" | "tarde" | "noite";

const shiftLabels: Record<Shift, string> = {
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
};

export default function Home() {
  const [selectedShift, setSelectedShift] = useState<Shift>("manha");
  const [showForm, setShowForm] = useState(false);

  const { data: allBookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Filtrar apenas agendamentos da semana atual (segunda a sexta)
  const weekBookings = allBookings?.filter((booking) => 
    isBookingInCurrentWeek(booking.weekStartDate)
  );

  const filteredBookings = weekBookings?.filter(
    (booking) => booking.shift === selectedShift
  );

  const todayBookings = weekBookings?.filter((booking) => {
    const today = new Date().getDay();
    const dayMap: Record<number, string> = {
      1: "segunda",
      2: "terca",
      3: "quarta",
      4: "quinta",
      5: "sexta",
    };
    return booking.dayOfWeek === dayMap[today];
  });
  
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground flex-shrink-0" data-testid="icon-logo">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base lg:text-lg font-medium leading-none truncate" data-testid="text-app-title">
                  <span className="hidden sm:inline">Laboratório de Informática</span>
                  <span className="sm:hidden">Lab Info</span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block" data-testid="text-app-subtitle">
                  Sistema de Agendamento
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="default"
                  data-testid="button-admin"
                  className="flex items-center"
                >
                  <Settings className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Admin</span>
                </Button>
              </Link>
              <Button
                onClick={() => setShowForm(!showForm)}
                size="default"
                data-testid="button-new-booking"
                className="flex items-center"
              >
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden sm:inline">Novo Agendamento</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {showForm && (
              <Card data-testid="card-new-booking-form">
                <CardHeader>
                  <CardTitle data-testid="text-form-title">Novo Agendamento</CardTitle>
                  <CardDescription data-testid="text-form-description">
                    Preencha os dados para agendar o laboratório
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingForm onSuccess={() => setShowForm(false)} />
                </CardContent>
              </Card>
            )}

            <div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-medium" data-testid="text-schedule-title">Agenda Semanal</h2>
                  <Badge variant="secondary" className="text-xs">Semana Atual</Badge>
                </div>
                <p className="text-muted-foreground text-sm" data-testid="text-schedule-description">
                  Agendamentos de {weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} a {weekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} • Renovado toda segunda-feira
                </p>
              </div>

              <Tabs value={selectedShift} onValueChange={(v) => setSelectedShift(v as Shift)}>
                <TabsList className="grid w-full grid-cols-3 mb-6" data-testid="tabs-shift">
                  <TabsTrigger value="manha" data-testid="tab-manha">
                    <Clock className="mr-2 h-4 w-4" />
                    Manhã
                  </TabsTrigger>
                  <TabsTrigger value="tarde" data-testid="tab-tarde">
                    <Clock className="mr-2 h-4 w-4" />
                    Tarde
                  </TabsTrigger>
                  <TabsTrigger value="noite" data-testid="tab-noite">
                    <Clock className="mr-2 h-4 w-4" />
                    Noite
                  </TabsTrigger>
                </TabsList>

                {["manha", "tarde", "noite"].map((shift) => (
                  <TabsContent key={shift} value={shift} className="mt-0">
                    <WeeklySchedule
                      shift={shift as Shift}
                      bookings={weekBookings || []}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          <div className="space-y-6">
            <Card data-testid="card-statistics">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base font-medium" data-testid="text-statistics-title">
                  Estatísticas
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" data-testid="icon-statistics" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-2xl font-medium" data-testid="text-total-bookings">
                    {weekBookings?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nesta semana
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-medium" data-testid="text-today-bookings">
                    {todayBookings?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Hoje
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-recent-bookings">
              <CardHeader>
                <CardTitle className="text-base font-medium" data-testid="text-recent-title">
                  Agendamentos Recentes
                </CardTitle>
                <CardDescription data-testid="text-recent-description">
                  Últimos agendamentos por turno
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : filteredBookings && filteredBookings.length > 0 ? (
                  <div className="space-y-4" data-testid="list-recent-bookings">
                    {filteredBookings.slice(0, 5).map((booking) => (
                      <BookingCard key={booking.id} booking={booking} compact />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center" data-testid="empty-state-bookings">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" data-testid="icon-empty-state" />
                    <h3 className="mt-4 text-sm font-medium" data-testid="text-empty-title">
                      Nenhum agendamento
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground" data-testid="text-empty-description">
                      Não há agendamentos para o turno de {shiftLabels[selectedShift].toLowerCase()}.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-4 border-t" data-testid="footer">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a
              href="https://wa.me/5582996697956"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-green-600 dark:hover:text-green-500 transition-colors"
              data-testid="whatsapp-support"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Suporte via WhatsApp
            </a>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-center">Sempre pré-agende seu horário no laboratório</span>
          </div>
          <p className="text-xs text-muted-foreground/60">
            Sistema desenvolvido pelo Prof. Antonio Gomes
          </p>
        </div>
      </footer>
    </div>
  );
}
