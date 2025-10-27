import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertBookingSchema, type InsertBooking } from "@shared/schema";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface BookingFormProps {
  onSuccess?: () => void;
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
  tarde: ["13:00", "13:50", "14:40", "15:30"],
  noite: ["18:00", "18:50", "19:40", "20:30"],
};

export function BookingForm({ onSuccess }: BookingFormProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      professorName: "",
      subject: "",
      shift: undefined,
      dayOfWeek: undefined,
      startTime: "",
      duration: "1",
      notes: "",
    },
  });

  const selectedShift = form.watch("shift");

  const createBookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      return await apiRequest("POST", "/api/bookings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Agendamento criado!",
        description: "O laboratório foi agendado com sucesso.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar agendamento",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBooking) => {
    createBookingMutation.mutate(data);
  };

  return (
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
                    data-testid="input-professor-name"
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
                <FormControl>
                  <Input
                    placeholder="Ex: Matemática, Português..."
                    {...field}
                    data-testid="input-subject"
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
                  defaultValue={field.value}
                  data-testid="select-shift"
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
                  defaultValue={field.value}
                  data-testid="select-day"
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
                defaultValue={field.value}
                disabled={!selectedShift}
                data-testid="select-time"
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
                  defaultValue={field.value}
                  className="flex gap-4"
                  data-testid="radio-duration"
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informações adicionais sobre o agendamento..."
                  className="resize-none"
                  {...field}
                  data-testid="textarea-notes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createBookingMutation.isPending}
          data-testid="button-submit-booking"
        >
          {createBookingMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando agendamento...
            </>
          ) : (
            "Criar Agendamento"
          )}
        </Button>
      </form>
    </Form>
  );
}
