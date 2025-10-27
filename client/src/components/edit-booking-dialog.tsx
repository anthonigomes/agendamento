import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertBookingSchema, type InsertBooking, type Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface EditBookingDialogProps {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const daysOfWeek = [
  { value: "segunda", label: "Segunda-feira" },
  { value: "terca", label: "Terça-feira" },
  { value: "quarta", label: "Quarta-feira" },
  { value: "quinta", label: "Quinta-feira" },
  { value: "sexta", label: "Sexta-feira" },
];

const shifts = [
  { value: "manha", label: "Manhã (7h - 12h)" },
  { value: "tarde", label: "Tarde (13h - 18h)" },
  { value: "noite", label: "Noite (18h - 22h)" },
];

const timeSlots = {
  manha: ["07:30", "08:20", "09:10", "10:00"],
  tarde: ["13:00", "14:00", "15:15", "16:15"],
  noite: ["18:50", "19:40", "20:45", "21:35"],
};

const subjects = [
  "Matemática",
  "Português",
  "Ciências",
  "História",
  "Geografia",
  "Arte",
  "Inglês",
  "Ed. Física",
  "Ens. Religioso",
];

const resources = [
  { value: "internet", label: "Internet" },
  { value: "projetor", label: "Projetor" },
  { value: "computadores", label: "Computadores" },
  { value: "livros", label: "Livros Didáticos" },
  { value: "tablet", label: "Tablets" },
  { value: "outros", label: "Outros" },
];

export function EditBookingDialog({ booking, open, onOpenChange }: EditBookingDialogProps) {
  const { toast } = useToast();

  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      professorName: booking.professorName,
      professorEmail: booking.professorEmail,
      professorPhone: booking.professorPhone,
      subject: booking.subject,
      shift: booking.shift as any,
      dayOfWeek: booking.dayOfWeek as any,
      startTime: booking.startTime,
      duration: booking.duration as any,
      objective: booking.objective,
      resources: booking.resources,
      notes: booking.notes || "",
    },
  });

  // Reset form when booking changes
  useEffect(() => {
    form.reset({
      professorName: booking.professorName,
      professorEmail: booking.professorEmail,
      professorPhone: booking.professorPhone,
      subject: booking.subject,
      shift: booking.shift as any,
      dayOfWeek: booking.dayOfWeek as any,
      startTime: booking.startTime,
      duration: booking.duration as any,
      objective: booking.objective,
      resources: booking.resources,
      notes: booking.notes || "",
    });
  }, [booking, form]);

  const selectedShift = form.watch("shift");

  const updateBookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      return await apiRequest("PATCH", `/api/bookings/${booking.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Agendamento atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBooking) => {
    updateBookingMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-edit-booking">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias e clique em salvar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="professorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Professor</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o nome completo"
                        {...field}
                        data-testid="input-edit-professor-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disciplina</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      data-testid="select-edit-subject"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="professorEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Professor</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="professor@escola.com"
                        {...field}
                        data-testid="input-edit-professor-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="professorPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone do Professor</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="(00) 00000-0000"
                        {...field}
                        data-testid="input-edit-professor-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="shift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turno</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      data-testid="select-edit-shift"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o turno" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shifts.map((shift) => (
                          <SelectItem key={shift.value} value={shift.value}>
                            {shift.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia da Semana</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      data-testid="select-edit-day"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o dia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário de Início</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedShift}
                    data-testid="select-edit-time"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedShift &&
                        timeSlots[selectedShift as keyof typeof timeSlots]?.map(
                          (time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {!selectedShift && "Selecione um turno primeiro"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Número de Aulas Simultâneas</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                      data-testid="radio-edit-duration"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          1 aula
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          2 aulas
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo da Aula</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo da aula no laboratório..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      data-testid="textarea-edit-objective"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resources"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Recursos Necessários</FormLabel>
                    <FormDescription>
                      Selecione os recursos que serão utilizados na aula
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {resources.map((resource) => (
                      <FormField
                        key={resource.value}
                        control={form.control}
                        name="resources"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={resource.value}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(resource.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, resource.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== resource.value
                                          )
                                        );
                                  }}
                                  data-testid={`checkbox-edit-resource-${resource.value}`}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {resource.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre o agendamento..."
                      className="resize-none"
                      rows={2}
                      {...field}
                      data-testid="textarea-edit-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-edit"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateBookingMutation.isPending}
                data-testid="button-save-edit"
              >
                {updateBookingMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
