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

type Shift = "manha" | "tarde" | "noite";

const shiftLabels: Record<Shift, string> = {
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
};

export default function Home() {
  const [selectedShift, setSelectedShift] = useState<Shift>("manha");
  const [showForm, setShowForm] = useState(false);

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const filteredBookings = bookings?.filter(
    (booking) => booking.shift === selectedShift
  );

  const todayBookings = bookings?.filter((booking) => {
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground" data-testid="icon-logo">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-medium leading-none" data-testid="text-app-title">
                  Laboratório de Informática
                </h1>
                <p className="text-sm text-muted-foreground" data-testid="text-app-subtitle">
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
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
              <Button
                onClick={() => setShowForm(!showForm)}
                size="default"
                data-testid="button-new-booking"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Agendamento
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
                <h2 className="text-2xl font-medium mb-2" data-testid="text-schedule-title">Agenda Semanal</h2>
                <p className="text-muted-foreground" data-testid="text-schedule-description">
                  Visualize e gerencie os horários disponíveis
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
                      bookings={bookings || []}
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
                    {bookings?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Agendamentos totais
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-medium" data-testid="text-today-bookings">
                    {todayBookings?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Agendamentos hoje
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
    </div>
  );
}
