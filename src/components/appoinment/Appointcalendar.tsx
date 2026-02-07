
import { 
    format, 
    startOfMonth, 
    endOfMonth, 
    eachDayOfInterval, 
    isSameDay, 
    isToday,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppointcalendarProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    className?: string;
}

export interface Appointment {
    id: string;
    clientName: string;
    service: string;
    date: Date;
    startTime: string;
    endTime: string;
    phone?: string;
    notes?: string;
    status: 'scheduled' | 'completed' | 'cancelled';
}

// AGREGAR 'export' AQUI TAMBIÉN:
export interface WorkingHours {
    startTime: string;
    endTime: string;
    slotDuration: number;
}

export function Appointcalendar({ selectedDate, onDateChange, className }: AppointcalendarProps) {
    // Lógica de fechas
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const allDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });

    // --- FUNCIONES DE NAVEGACIÓN ---
    const nextMonth = () => onDateChange(addMonths(selectedDate, 1));
    const prevMonth = () => onDateChange(subMonths(selectedDate, 1));
    
    // Función para volver al presente
    const goToToday = () => {
        onDateChange(new Date());
    };

    const weekDays = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];

    return (
        <Card className={cn("border-none shadow-sm bg-white overflow-hidden", className)}>
            <CardHeader className="pb-3 border-b border-slate-50">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                            <span className="capitalize">
                                {format(selectedDate, 'MMMM yyyy', { locale: es })}
                            </span>
                        </CardTitle>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* BOTÓN "HOY": Solo se muestra si no estamos ya en el día de hoy */}
                        {!isToday(selectedDate) && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={goToToday}
                                className="h-7 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary hover:bg-primary/10 transition-all"
                            >
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Hoy
                            </Button>
                        )}

                        <div className="flex gap-1">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={prevMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={nextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3">
                <div className="grid grid-cols-7 mb-2">
                    {weekDays.map((day) => (
                        <span key={day} className="text-[10px] font-bold text-center text-slate-400 uppercase">
                            {day}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {allDays.map((day) => {
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);
                        
                        return (
                            <button
                                key={day.toString()}
                                onClick={() => onDateChange(day)}
                                type="button"
                                className={cn(
                                    "aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition-all",
                                    isSelected 
                                        ? "bg-primary text-white shadow-md font-bold scale-110 z-10" 
                                        : "hover:bg-slate-100 text-slate-600",
                                    !isCurrentMonth && "opacity-20",
                                    isToday(day) && !isSelected && "text-primary font-bold border border-primary/30 bg-primary/5"
                                )}
                            >
                                {format(day, 'd')}
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}