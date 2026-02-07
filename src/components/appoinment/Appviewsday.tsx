import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface AppviewsdayProps {
    selectedDate: Date;
    appointments: any[];
    onDateChange: (date: Date) => void;
}

export default function Appviewsday({
    selectedDate,
    appointments,
    onDateChange
}: AppviewsdayProps) {
    // Generamos los próximos 7 días
    const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

    return (
        <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-2">
                {/* Cambiamos space-y-2 por un grid horizontal.
                    - grid-cols-2 en móviles
                    - grid-cols-4 en tablets
                    - grid-cols-7 en escritorio
                */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {next7Days.map((day) => {
                        const dayAppointments = appointments.filter((apt) =>
                            isSameDay(apt.date, day)
                        );
                        const isSelected = isSameDay(day, selectedDate);

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => onDateChange(day)}
                                className={cn(
                                    "relative flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                                        : "border-slate-100 bg-white hover:border-primary/50 hover:bg-slate-50"
                                )}
                            >
                                {/* Nombre del día corto (lun, mar...) */}
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-tighter",
                                    isSelected ? "text-primary" : "text-slate-400"
                                )}>
                                    {format(day, 'EEEE', { locale: es })}
                                </span>
                                
                                {/* Número del día */}
                                <span className="text-xl font-bold text-slate-800">
                                    {format(day, 'd')}
                                </span>

                                {/* Badge minimalista para el conteo de citas */}
                                <div className="mt-1">
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "h-5 px-1.5 text-[10px] font-medium border-none",
                                            dayAppointments.length > 0
                                                ? 'bg-primary/20 text-primary'
                                                : 'bg-slate-100 text-slate-400'
                                        )}
                                    >
                                        {dayAppointments.length} {dayAppointments.length === 1 ? 'cita' : 'citas'}
                                    </Badge>
                                </div>

                                {/* Pequeño indicador visual si está seleccionado */}
                                {isSelected && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}