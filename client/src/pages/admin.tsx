import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Calendar, Users, BookOpen, Clock, Target, Wifi, Projector, Book, Tablet, MoreHorizontal, User as UserIcon, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { EditBookingDialog } from "@/components/edit-booking-dialog";

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

const resourceIcons: Record<string, React.ComponentType<any>> = {
  internet: Wifi,
  projetor: Projector,
  livros: Book,
  tablet: Tablet,
  computadores: UserIcon,
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

export default function AdminPage() {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/bookings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Agendamento excluído!",
        description: "O agendamento foi removido com sucesso.",
      });
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o agendamento.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (id: string) => {
    setBookingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (booking: Booking) => {
    setBookingToEdit(booking);
    setEditDialogOpen(true);
  };

  const confirmDelete = () => {
    if (bookingToDelete) {
      deleteBookingMutation.mutate(bookingToDelete);
    }
  };

  // Statistics
  const totalBookings = bookings.length;
  const bookingsByProfessor = bookings.reduce((acc, booking) => {
    acc[booking.professorName] = (acc[booking.professorName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const bookingsBySubject = bookings.reduce((acc, booking) => {
    acc[booking.subject] = (acc[booking.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const bookingsByShift = bookings.reduce((acc, booking) => {
    acc[booking.shift] = (acc[booking.shift] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topProfessors = Object.entries(bookingsByProfessor)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topSubjects = Object.entries(bookingsBySubject)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="container mx-auto p-4 space-y-6" data-testid="admin-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="page-title">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1" data-testid="page-description">
            Gerencie todos os agendamentos do laboratório
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-total-bookings">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total">{totalBookings}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-shift-stats">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Turno</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.entries(bookingsByShift).map(([shift, count]) => (
                <div key={shift} className="flex justify-between text-sm" data-testid={`stat-shift-${shift}`}>
                  <span className="text-muted-foreground">{shiftLabels[shift]}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-professors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Professores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {topProfessors.slice(0, 3).map(([name, count]) => (
                <div key={name} className="flex justify-between text-sm" data-testid={`stat-professor-${name}`}>
                  <span className="text-muted-foreground truncate max-w-[150px]">{name}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-subjects">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Disciplinas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {topSubjects.slice(0, 3).map(([subject, count]) => (
                <div key={subject} className="flex justify-between text-sm" data-testid={`stat-subject-${subject}`}>
                  <span className="text-muted-foreground truncate max-w-[150px]">{subject}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Agendamentos</CardTitle>
          <CardDescription>
            Lista completa de agendamentos com opções de edição e exclusão
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8" data-testid="loading-bookings">Carregando...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="no-bookings">
              Nenhum agendamento encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Professor</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Dia</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Objetivo</TableHead>
                    <TableHead>Recursos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} data-testid={`row-booking-${booking.id}`}>
                      <TableCell className="font-medium" data-testid="cell-professor">
                        {booking.professorName}
                      </TableCell>
                      <TableCell data-testid="cell-subject">{booking.subject}</TableCell>
                      <TableCell data-testid="cell-shift">
                        <Badge variant="outline">{shiftLabels[booking.shift]}</Badge>
                      </TableCell>
                      <TableCell data-testid="cell-day">{dayLabels[booking.dayOfWeek]}</TableCell>
                      <TableCell data-testid="cell-time">{booking.startTime}</TableCell>
                      <TableCell data-testid="cell-duration">
                        {booking.duration === "1" ? "1 aula" : "2 aulas"}
                      </TableCell>
                      <TableCell className="max-w-[200px]" data-testid="cell-objective">
                        <div className="truncate text-sm text-muted-foreground">
                          {booking.objective}
                        </div>
                      </TableCell>
                      <TableCell data-testid="cell-resources">
                        <div className="flex flex-wrap gap-1">
                          {booking.resources.slice(0, 2).map((resource) => {
                            const Icon = resourceIcons[resource] || MoreHorizontal;
                            return (
                              <Badge key={resource} variant="secondary" className="gap-1 text-xs">
                                <Icon className="h-2.5 w-2.5" />
                                <span className="sr-only">{resourceLabels[resource]}</span>
                              </Badge>
                            );
                          })}
                          {booking.resources.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{booking.resources.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(booking)}
                            data-testid={`button-edit-${booking.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(booking.id)}
                            data-testid={`button-delete-${booking.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="dialog-delete-confirm">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      {bookingToEdit && (
        <EditBookingDialog
          booking={bookingToEdit}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </div>
  );
}
