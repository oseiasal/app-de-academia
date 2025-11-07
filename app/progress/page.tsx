'use client';

import { useState, useEffect } from 'react';
import { getRepository } from '../../lib/indexeddb';
import { LogEntry, Exercise, Workout } from '../../lib/types';

export default function ProgressPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [exercises, setExercises] = useState<Record<string, Exercise>>({});
  const [workouts, setWorkouts] = useState<Record<string, Workout>>({});
  const [selectedPeriod, setSelectedPeriod] = useState('30'); // dias

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const repository = await getRepository();
      
      const allLogs = await repository.getAllLogs();
      const allExercises = await repository.getAllExercises();
      const allWorkouts = await repository.getAllWorkouts();
      
      setLogs(allLogs);
      
      const exerciseMap: Record<string, Exercise> = {};
      allExercises.forEach(ex => exerciseMap[ex.id] = ex);
      setExercises(exerciseMap);

      const workoutMap: Record<string, Workout> = {};
      allWorkouts.forEach(w => workoutMap[w.id] = w);
      setWorkouts(workoutMap);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const getFilteredLogs = () => {
    const days = parseInt(selectedPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return logs.filter(log => new Date(log.dataRealizada) >= cutoffDate);
  };

  const calculateStats = () => {
    const filteredLogs = getFilteredLogs();
    
    const totalWorkouts = filteredLogs.length;
    const totalSets = filteredLogs.reduce((sum, log) => sum + log.setsRealizados.length, 0);
    
    // Volume total (tonnage)
    const totalVolume = filteredLogs.reduce((sum, log) => {
      return sum + log.setsRealizados.reduce((setSum, set) => {
        return setSum + ((set.cargaKg || 0) * set.reps);
      }, 0);
    }, 0);

    // Frequência por grupo muscular
    const muscleFrequency: Record<string, number> = {};
    filteredLogs.forEach(log => {
      log.setsRealizados.forEach(set => {
        const exercise = exercises[set.exerciseId];
        if (exercise) {
          exercise.gruposMusculares.forEach(muscle => {
            muscleFrequency[muscle] = (muscleFrequency[muscle] || 0) + 1;
          });
        }
      });
    });

    // PRs recentes
    const recentPRs: Array<{exerciseId: string, reps: number, weight: number, date: string}> = [];
    filteredLogs.forEach(log => {
      log.setsRealizados.forEach(set => {
        if (set.cargaKg && set.reps) {
          recentPRs.push({
            exerciseId: set.exerciseId,
            reps: set.reps,
            weight: set.cargaKg,
            date: log.dataRealizada
          });
        }
      });
    });

    return {
      totalWorkouts,
      totalSets,
      totalVolume,
      muscleFrequency,
      recentPRs: recentPRs.slice(-5) // Últimos 5 PRs
    };
  };

  const stats = calculateStats();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Progresso</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
          <option value="365">Último ano</option>
        </select>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalWorkouts}</div>
            <div className="text-gray-600">Treinos Realizados</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.totalSets}</div>
            <div className="text-gray-600">Séries Completadas</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(stats.totalVolume).toLocaleString()}
            </div>
            <div className="text-gray-600">Volume Total (kg)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Frequência por Grupo Muscular */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Frequência por Grupo Muscular</h2>
          <div className="space-y-3">
            {Object.entries(stats.muscleFrequency)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([muscle, count]) => (
              <div key={muscle} className="flex justify-between items-center">
                <span className="capitalize">{muscle}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(count / Math.max(...Object.values(stats.muscleFrequency))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimos Treinos */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Últimos Treinos</h2>
          <div className="space-y-3">
            {getFilteredLogs().slice(-5).reverse().map((log, index) => {
              const workout = workouts[log.workoutId];
              const date = new Date(log.dataRealizada).toLocaleDateString('pt-BR');
              
              return (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="font-medium">{workout?.nome || 'Treino'}</div>
                  <div className="text-sm text-gray-600">{date}</div>
                  <div className="text-sm text-gray-500">
                    {log.setsRealizados.length} séries realizadas
                  </div>
                </div>
              );
            })}
            {getFilteredLogs().length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Nenhum treino realizado no período selecionado
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Gráfico de Evolução */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Evolução do Volume Semanal</h2>
        <div className="h-64 flex items-end justify-center gap-2">
          {getWeeklyVolume(getFilteredLogs()).map((week, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="bg-blue-600 w-8 rounded-t"
                style={{
                  height: `${(week.volume / Math.max(...getWeeklyVolume(getFilteredLogs()).map(w => w.volume))) * 200}px`,
                  minHeight: '4px'
                }}
              ></div>
              <div className="text-xs mt-2 text-gray-600 transform -rotate-45 origin-center">
                {week.week}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getWeeklyVolume(logs: LogEntry[]) {
  const weeks: Record<string, number> = {};
  
  logs.forEach(log => {
    const date = new Date(log.dataRealizada);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    const volume = log.setsRealizados.reduce((sum, set) => {
      return sum + ((set.cargaKg || 0) * set.reps);
    }, 0);
    
    weeks[weekKey] = (weeks[weekKey] || 0) + volume;
  });

  return Object.entries(weeks)
    .map(([week, volume]) => ({
      week: new Date(week).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      volume
    }))
    .sort((a, b) => a.week.localeCompare(b.week));
}