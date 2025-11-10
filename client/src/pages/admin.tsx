import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
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
import { Pencil, Trash2, Calendar, Users, BookOpen, Clock, Target, Wifi, Projector, Book, Tablet, MoreHorizontal, User as UserIcon, ArrowLeft, LogOut } from "lucide-react";
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
  const [, setLocation] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is authenticated as admin
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/status");
        const data = await response.json();
        
        if (!data.isAdmin) {
          setLocation("/admin/login");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setLocation("/admin/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [setLocation]);

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    enabled: !isCheckingAuth,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      setLocation("/admin/login");
    },
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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-auth">
        <div className="text-center">
          <div className="text-lg">Verificando autenticação...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6" data-testid="admin-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold truncate" data-testid="page-title">Painel Administrativo</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1" data-testid="page-description">
            Gerencie todos os agendamentos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            data-testid="button-logout"
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
          <Link href="/">
            <Button variant="outline" data-testid="button-back-home" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          </Link>
        </div>
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
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="p-4" data-testid={`card-booking-${booking.id}`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium truncate">{booking.professorName}</h3>
                          <p className="text-sm text-muted-foreground">{booking.subject}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEditClick(booking)}
                            data-testid={`button-edit-${booking.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDeleteClick(booking.id)}
                            data-testid={`button-delete-${booking.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Turno:</span>
                          <div className="mt-1">
                            <Badge variant="outline">{shiftLabels[booking.shift]}</Badge>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Dia:</span>
                          <p className="mt-1 font-medium">{dayLabels[booking.dayOfWeek]}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Horário:</span>
                          <p className="mt-1 font-medium">{booking.startTime}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duração:</span>
                          <p className="mt-1 font-medium">
                            {booking.duration === "1" ? "1 aula" : "2 aulas"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-muted-foreground">Objetivo:</span>
                        <p className="text-sm mt-1 line-clamp-2">{booking.objective}</p>
                      </div>

                      {booking.resources.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">Recursos:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {booking.resources.map((resource) => {
                              const Icon = resourceIcons[resource] || MoreHorizontal;
                              return (
                                <Badge key={resource} variant="secondary" className="gap-1 text-xs">
                                  <Icon className="h-3 w-3" />
                                  <span>{resourceLabels[resource]}</span>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
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
                              variant="destructive"
                              onClick={() => handleDeleteClick(booking.id)}
                              data-testid={`button-delete-${booking.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
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

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t text-center space-y-3" data-testid="footer">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
          <a
            href="https://wa.me/5582996697956"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-600 dark:text-green-500 hover:underline font-medium"
            data-testid="whatsapp-support"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Suporte para Agendamento: (82) 99669-7956
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          ⚠️ Sempre pré-agende seu horário no laboratório e preencha os campos solicitados.
        </p>
        <p className="text-xs text-muted-foreground">
          Sistema desenvolvido pelo Prof. Antonio Gomes
        </p>
      </footer>
    </div>
  );
}
