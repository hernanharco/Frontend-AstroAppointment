import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface AppoindayProps {
    selectedDate: Date;
    appointments: any[];
    workingHours: any;
    timeSlots: string[];
    appointmentsForSelectedDate: any[];
    onDeleteAppointment: (id: string) => void;
}

export default function Appoinday({
    selectedDate,
    appointments,
    workingHours,
    timeSlots,
    appointmentsForSelectedDate,
    onDeleteAppointment
}: AppoindayProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-500/10 text-blue-700 border-blue-200';
            case 'completed':
                return 'bg-green-500/10 text-green-700 border-green-200';
            case 'cancelled':
                return 'bg-red-500/10 text-red-700 border-red-200';
            default:
                return 'bg-gray-500/10 text-gray-700 border-gray-200';
        }
    };

    return (
        <>
            {/* Columna izquierda: Horario del día */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Horario de {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                            </CardTitle>
                            <div className="text-sm text-gray-600">
                                {workingHours.startTime} - {workingHours.endTime}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px] pr-4">
                            <div className="space-y-2">
                                {timeSlots.map((time) => {
                                    const appointment = appointmentsForSelectedDate.find(
                                        (apt) => apt.startTime === time
                                    );

                                    return (
                                        <div
                                            key={time}
                                            className="flex items-start gap-4 border-b border-gray-100 pb-2"
                                        >
                                            <div className="w-20 shrink-0 pt-2 text-sm font-medium text-gray-600">
                                                {time}
                                            </div>
                                            {appointment ? (
                                                <div
                                                    className={`flex-1 rounded-lg border p-3 ${getStatusColor(
                                                        appointment.status
                                                    )}`}
                                                >
                                                    <div className="mb-1 flex items-start justify-between">
                                                        <div>
                                                            <div className="font-semibold">
                                                                {appointment.clientName}
                                                            </div>
                                                            <div className="text-sm">{appointment.service}</div>
                                                        </div>
                                                        <Badge variant="outline" className="ml-2">
                                                            {appointment.startTime} - {appointment.endTime}
                                                        </Badge>
                                                    </div>
                                                    {appointment.phone && (
                                                        <div className="text-sm text-gray-600">
                                                            📞 {appointment.phone}
                                                        </div>
                                                    )}
                                                    {appointment.notes && (
                                                        <div className="mt-2 text-sm text-gray-600">
                                                            {appointment.notes}
                                                        </div>
                                                    )}
                                                    <div className="mt-2 flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => onDeleteAppointment(appointment.id)}
                                                            className="h-7 text-xs"
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1 rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-3 text-center text-sm text-gray-400">
                                                    Disponible
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
