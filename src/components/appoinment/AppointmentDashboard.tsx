import React, { useEffect, useState } from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import AppointmentHeader from './AppointmentHeader';
import { Appointcalendar, WorkingHours, Appointment } from './Appointcalendar';
import Appoinday from './Appoinday';
import Appviewsday from './Appviewsday';
import { api } from '@/lib/api';

const DEFAULT_WORKING_HOURS: WorkingHours = {
    startTime: '09:00',
    endTime: '18:00',
    slotDuration: 30,
};

export default function AppointmentDashboard() {
    // --- ESTADOS ---
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([
        {
            id: '1',
            clientName: 'María González',
            service: 'Corte de cabello',
            date: new Date(),
            startTime: '10:00',
            endTime: '10:30',
            phone: '555-0101',
            status: 'scheduled',
        },
        {
            id: '2',
            clientName: 'Juan Pérez',
            service: 'Consulta general',
            date: new Date(),
            startTime: '11:00',
            endTime: '12:00',
            phone: '555-0102',
            status: 'scheduled',
        },
        {
            id: '3',
            clientName: 'Ana Martínez',
            service: 'Tratamiento facial',
            date: addDays(new Date(), 1),
            startTime: '14:00',
            endTime: '15:00',
            phone: '555-0103',
            status: 'scheduled',
        },
    ]);
    const [workingHours, setWorkingHours] = useState<WorkingHours>(DEFAULT_WORKING_HOURS);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        clientName: '',
        service: '',
        startTime: '',
        duration: '30',
        phone: '',
        notes: '',
    });

    // --- LÓGICA DE NEGOCIO ---
    const generateTimeSlots = () => {
        const slots: string[] = [];
        const [startHour, startMinute] = workingHours.startTime.split(':').map(Number);
        const [endHour, endMinute] = workingHours.endTime.split(':').map(Number);

        let currentTime = startHour * 60 + startMinute;
        const endTimeMinutes = endHour * 60 + endMinute;

        while (currentTime < endTimeMinutes) {
            const hours = Math.floor(currentTime / 60);
            const minutes = currentTime % 60;
            slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
            currentTime += workingHours.slotDuration;
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();
    const appointmentsForSelectedDate = appointments.filter((apt) =>
        isSameDay(apt.date, selectedDate)
    );

    // --- ACCIONES ---
    const handleAddAppointment = () => {
        if (!newAppointment.clientName || !newAppointment.startTime) return;

        const duration = parseInt(newAppointment.duration);
        const [hours, minutes] = newAppointment.startTime.split(':').map(Number);
        const endTimeMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(endTimeMinutes / 60);
        const endMinutes = endTimeMinutes % 60;

        const appointment: Appointment = {
            id: Date.now().toString(),
            clientName: newAppointment.clientName,
            service: newAppointment.service,
            date: selectedDate,
            startTime: newAppointment.startTime,
            endTime: `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`,
            phone: newAppointment.phone,
            notes: newAppointment.notes,
            status: 'scheduled',
        };

        setAppointments([...appointments, appointment]);
        setIsAddDialogOpen(false);
        setNewAppointment({
            clientName: '', service: '', startTime: '', duration: '30', phone: '', notes: '',
        });
    };

    const handleDeleteAppointment = (id: string) => {
        setAppointments(appointments.filter((apt) => apt.id !== id));
    };

    // const loadAllData = async () => {
    //     try {
    //         // Llamada sin pasarle ninguna fecha para traer TODO
    //         const allAppointments = await api.getAppointments();

    //         console.log("📦 Todas las citas en la DB:", allAppointments);
    //         console.table(allAppointments);
    //     } catch (error) {
    //         console.error("Error al traer los datos:", error);
    //     }
    // };

    // useEffect(() => {
    //     loadAllData();
    // }, []);

    // --- FUNCIONES --- 
    // --- Guardado de GESTIÓN DE CITAS ---
    const handleSaveAppointment = async (data: typeof newAppointment) => {
    try {
        // Combinamos la fecha del calendario con la hora del selector
        const [hours, minutes] = data.startTime.split(':');
        const appointmentDate = new Date(selectedDate);
        appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0);

        const appointmentData = {
            client_name: data.clientName,
            client_phone: data.phone,
            service_id: 1, // Por ahora fijo, luego puedes añadir un select de servicios
            collaborator_id: 1, // Por ahora fijo
            start_time: appointmentDate.toISOString(), // "2026-02-07T10:00:00.000Z"
            duration_minutes: parseInt(data.duration),
            status: 'scheduled',
            notes: data.notes
        };

        const savedApt = await api.createAppointment(appointmentData);
        
        // Actualizamos el estado local para que aparezca en el timeline
        // Ojo: Asegúrate de transformar savedApt de vuelta al formato de tu interfaz Appointment
        setAppointments(prev => [...prev, {
            id: savedApt.id.toString(),
            clientName: savedApt.client_name,
            service: "Servicio", // O lo que devuelva tu backend
            date: new Date(savedApt.start_time),
            startTime: data.startTime,
            endTime: "11:00", // Calcula esto según duración
            phone: savedApt.client_phone,
            status: savedApt.status
        }]);

        setIsAddDialogOpen(false);
        alert("¡Cita guardada en la base de datos de Neon!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
    }
};

    // --- RENDERIZADO ---
    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* 1. CABECERA PRINCIPAL (Botón Añadir, Ajustes, etc.) */}
                <AppointmentHeader
                    selectedDate={selectedDate}
                    onAddClick={() => setIsAddDialogOpen(true)}
                    onSettingsClick={() => setIsSettingsDialogOpen(true)}
                    onDateChange={setSelectedDate}
                    workingHours={workingHours}
                    onWorkingHoursChange={setWorkingHours}
                    newAppointment={newAppointment}
                    onNewAppointmentChange={setNewAppointment}
                    timeSlots={timeSlots}
                    // CAMBIO AQUÍ: Ahora pasamos la función que habla con el Backend
                    onAddAppointment={() => handleSaveAppointment(newAppointment)}
                />

                {/* 2. HEADER SECUNDARIO: Resumen de Próximos Días (Ancho completo) */}
                {/* Al sacarlo del grid, ahora se verá horizontalmente arriba de las dos columnas */}
                <Appviewsday
                    selectedDate={selectedDate}
                    appointments={appointments}
                    onDateChange={setSelectedDate}
                />

                {/* 3. GRID PRINCIPAL (Timeline + Calendario) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* COLUMNA IZQUIERDA: LÍNEA DE TIEMPO (8 de 12 columnas) */}
                    <main className="lg:col-span-8">
                        <Appoinday
                            selectedDate={selectedDate}
                            appointments={appointments}
                            workingHours={workingHours}
                            timeSlots={timeSlots}
                            appointmentsForSelectedDate={appointmentsForSelectedDate}
                            onDeleteAppointment={handleDeleteAppointment}
                        />
                    </main>

                    {/* COLUMNA DERECHA: MINI CALENDARIO (4 de 12 columnas) */}
                    <aside className="lg:col-span-4">
                        <Appointcalendar
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                            className="w-full"
                        />
                    </aside>

                </div>
            </div>
        </div>
    );
}