'use client';

import { useState, useEffect } from 'react';
import { getRepository } from '../../lib/indexeddb';
import { Workout, LogEntry } from '../../lib/types';

export default function CalendarPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const repository = await getRepository();
      
      const allWorkouts = await repository.getAllWorkouts();
      const allLogs = await repository.getAllLogs();
      
      setWorkouts(allWorkouts);
      setLogs(allLogs);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias do mês anterior para preencher o início
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, isCurrentMonth: false });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }

    // Dias do próximo mês para completar a grade
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const getWorkoutsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return workouts.filter(workout => workout.dataPlanejada === dateString);
  };

  const getLogsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return logs.filter(log => log.dataRealizada.startsWith(dateString));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header do Calendário */}
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl font-bold capitalize">{monthName}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 border rounded hover:bg-gray-50"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Hoje
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 border rounded hover:bg-gray-50"
            >
              →
            </button>
          </div>
        </div>

        {/* Dias da Semana */}
        <div className="grid grid-cols-7 border-b">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-600 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Grade do Calendário */}
        <div className="grid grid-cols-7">
          {days.map(({ date, isCurrentMonth }, index) => {
            const workoutsForDay = getWorkoutsForDate(date);
            const logsForDay = getLogsForDate(date);
            const isToday = date.toDateString() === today.toDateString();

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-700' : ''}`}>
                  {date.getDate()}
                </div>

                {/* Treinos Planejados */}
                {workoutsForDay.map(workout => (
                  <div
                    key={workout.id}
                    className="mb-1 p-1 bg-blue-100 text-blue-800 text-xs rounded cursor-pointer hover:bg-blue-200"
                    title={workout.nome}
                  >
                    📋 {workout.nome?.substring(0, 15)}
                    {workout.nome && workout.nome.length > 15 ? '...' : ''}
                  </div>
                ))}

                {/* Treinos Realizados */}
                {logsForDay.map((log, logIndex) => {
                  const workout = workouts.find(w => w.id === log.workoutId);
                  return (
                    <div
                      key={logIndex}
                      className="mb-1 p-1 bg-green-100 text-green-800 text-xs rounded"
                      title={`Treino realizado: ${workout?.nome}`}
                    >
                      ✅ {workout?.nome?.substring(0, 15) || 'Treino'}
                      {workout?.nome && workout.nome.length > 15 ? '...' : ''}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Estatísticas do Mês */}
        <div className="p-6 border-t bg-gray-50">
          <h3 className="font-semibold mb-3">Estatísticas do Mês</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {workouts.filter(w => {
                  if (!w.dataPlanejada) return false;
                  const workoutDate = new Date(w.dataPlanejada);
                  return workoutDate.getMonth() === currentMonth.getMonth() &&
                         workoutDate.getFullYear() === currentMonth.getFullYear();
                }).length}
              </div>
              <div className="text-gray-600">Treinos Planejados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {logs.filter(log => {
                  const logDate = new Date(log.dataRealizada);
                  return logDate.getMonth() === currentMonth.getMonth() &&
                         logDate.getFullYear() === currentMonth.getFullYear();
                }).length}
              </div>
              <div className="text-gray-600">Treinos Realizados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {logs.reduce((total, log) => {
                  const logDate = new Date(log.dataRealizada);
                  if (logDate.getMonth() === currentMonth.getMonth() &&
                      logDate.getFullYear() === currentMonth.getFullYear()) {
                    return total + log.setsRealizados.length;
                  }
                  return total;
                }, 0)}
              </div>
              <div className="text-gray-600">Séries Realizadas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}