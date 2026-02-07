import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Settings } from 'lucide-react';
import { Plus } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentHeaderProps {
  selectedDate: Date;
  onAddClick: () => void;
  onSettingsClick: () => void;
  onDateChange: (date: Date) => void;
  workingHours: {
    startTime: string;
    endTime: string;
    slotDuration: number;
  };
  onWorkingHoursChange: (hours: any) => void;
  newAppointment: any;
  onNewAppointmentChange: (appointment: any) => void;
  timeSlots: string[];
  onAddAppointment: () => void;
}

export default function AppointmentHeader({
  selectedDate,
  onAddClick,
  onSettingsClick,
  onDateChange,
  workingHours,
  onWorkingHoursChange,
  newAppointment,
  onNewAppointmentChange,
  timeSlots,
  onAddAppointment
}: AppointmentHeaderProps) {
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleSettingsClick = () => {
    setIsSettingsDialogOpen(true);
    onSettingsClick();
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
    onAddClick();
  };
  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Control de Citas</h1>
          <p className="text-gray-600">Gestiona tus citas y horarios</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configuración de Horario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="startTime">Hora de Inicio</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={workingHours.startTime}
                    onChange={(e) =>
                      onWorkingHoursChange({ ...workingHours, startTime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Hora de Fin</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={workingHours.endTime}
                    onChange={(e) =>
                      onWorkingHoursChange({ ...workingHours, endTime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="slotDuration">Duración de Cita (minutos)</Label>
                  <Select
                    value={workingHours.slotDuration.toString()}
                    onValueChange={(value) =>
                      onWorkingHoursChange({ ...workingHours, slotDuration: parseInt(value) })
                    }
                  >
                    <SelectTrigger id="slotDuration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => setIsSettingsDialogOpen(false)}
                  className="w-full"
                >
                  Guardar Configuración
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Cita</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Nombre del Cliente *</Label>
                  <Input
                    id="clientName"
                    value={newAppointment.clientName}
                    onChange={(e) =>
                      onNewAppointmentChange({ ...newAppointment, clientName: e.target.value })
                    }
                    placeholder="Ej: María González"
                  />
                </div>
                <div>
                  <Label htmlFor="service">Servicio</Label>
                  <Input
                    id="service"
                    value={newAppointment.service}
                    onChange={(e) =>
                      onNewAppointmentChange({ ...newAppointment, service: e.target.value })
                    }
                    placeholder="Ej: Corte de cabello"
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">Hora de Inicio *</Label>
                  <Select
                    value={newAppointment.startTime}
                    onValueChange={(value) =>
                      onNewAppointmentChange({ ...newAppointment, startTime: value })
                    }
                  >
                    <SelectTrigger id="startTime">
                      <SelectValue placeholder="Selecciona una hora" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-48">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duración</Label>
                  <Select
                    value={newAppointment.duration}
                    onValueChange={(value) =>
                      onNewAppointmentChange({ ...newAppointment, duration: value })
                    }
                  >
                    <SelectTrigger id="duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="90">1.5 horas</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={newAppointment.phone}
                    onChange={(e) =>
                      onNewAppointmentChange({ ...newAppointment, phone: e.target.value })
                    }
                    placeholder="Ej: 555-0101"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    value={newAppointment.notes}
                    onChange={(e) =>
                      onNewAppointmentChange({ ...newAppointment, notes: e.target.value })
                    }
                    placeholder="Notas adicionales..."
                    rows={3}
                  />
                </div>
                <Button onClick={onAddAppointment} className="w-full">
                  Agregar Cita
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}
