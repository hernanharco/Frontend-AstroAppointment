// src/lib/api.ts

// URL base de la API desde variables de entorno de Astro
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = {
    /**
     * OBTENER CITAS (Listado y filtrado)
     */
    getAppointments: async (date?: string) => {
        const url = new URL(`${API_BASE_URL}/appointments/`);
        if (date) url.searchParams.append('date', date);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Error al obtener citas');
        return response.json();
    },

    getAppointmentById: async (id: number | string) => {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}/`);
        if (!response.ok) throw new Error('Cita no encontrada');
        return response.json();
    },

    /**
     * GESTIÓN DE CITAS (Crear, Actualizar, Eliminar)
     */
    createAppointment: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/appointments/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Error al crear cita');
        return response.json();
    },

    updateAppointment: async (id: number | string, data: any) => {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Error al actualizar cita');
        return response.json();
    },

    deleteAppointment: async (id: number | string) => {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}/`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar cita');
        return true;
    },

    /**
     * FLUJO DE ESTADOS (Confirmar y Completar)
     */
    confirmAppointment: async (id: number | string) => {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}/confirm`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Error al confirmar cita');
        return response.json();
    },

    completeAppointment: async (id: number | string) => {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}/complete`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Error al completar cita');
        return response.json();
    },

    /**
     * DISPONIBILIDAD Y ESTADÍSTICAS
     */
    getAvailableSlots: async (date: string, collaboratorId?: number) => {
        const url = new URL(`${API_BASE_URL}/appointments/availability/slots`);
        url.searchParams.append('date', date);
        if (collaboratorId) url.searchParams.append('collaborator_id', collaboratorId.toString());

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Error al obtener huecos disponibles');
        return response.json();
    },

    getStatsSummary: async () => {
        const response = await fetch(`${API_BASE_URL}/appointments/stats/summary`);
        if (!response.ok) throw new Error('Error al obtener estadísticas');
        return response.json();
    }
};