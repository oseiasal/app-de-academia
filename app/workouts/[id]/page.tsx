'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getRepository } from '../../../lib/indexeddb';
import { Workout, Exercise, LogEntry } from '../../../lib/types';

export default function WorkoutExecutionPage() {
  const params = useParams();
  const workoutId = params.id as string;
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Record<string, Exercise>>({});
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completedSets, setCompletedSets] = useState<any[]>([]);

  useEffect(() => {
    fetchWorkoutData();
  }, [workoutId]);

  const fetchWorkoutData = async () => {
    try {
      const repository = await getRepository();
      const workoutData = await repository.getWorkoutById(workoutId);
      
      if (!workoutData) {
        console.error('Treino não encontrado');
        return;
      }
      
      setWorkout(workoutData);
      
      // Buscar exercícios relacionados
      const exerciseIds = workoutData.blocos.flatMap(bloco => 
        bloco.exercicios.map(ex => ex.exerciseId)
      );
      
      const exerciseMap: Record<string, Exercise> = {};
      for (const id of exerciseIds) {
        const exercise = await repository.getExerciseById(id);
        if (exercise) {
          exerciseMap[id] = exercise;
        }
      }
      setExercises(exerciseMap);
    } catch (error) {
      console.error('Erro ao carregar dados do treino:', error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const allExercises = workout?.blocos.flatMap(bloco => bloco.exercicios) || [];
  const currentExercise = allExercises[currentExerciseIndex];
  const currentSet = currentExercise?.series[currentSetIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completeSet = (reps: number, weight: number, rpe?: number) => {
    if (!currentExercise || !workout) return;

    const completedSet = {
      exerciseId: currentExercise.exerciseId,
      serieIndex: currentSetIndex,
      reps,
      cargaKg: weight,
      rpe
    };

    setCompletedSets(prev => [...prev, completedSet]);

    if (currentSetIndex < currentExercise.series.length - 1) {
      setCurrentSetIndex(prev => prev + 1);
      if (currentSet?.descansoSeg) {
        setRestTimer(currentSet.descansoSeg);
        setIsResting(true);
      }
    } else if (currentExerciseIndex < allExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(0);
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = async () => {
    if (!workout) return;

    try {
      const repository = await getRepository();
      await repository.createLog({
        workoutId: workout.id,
        dataRealizada: new Date().toISOString(),
        setsRealizados: completedSets
      });

      alert('Treino concluído! 🎉');
    } catch (error) {
      console.error('Erro ao finalizar treino:', error);
      alert('Erro ao salvar treino');
    }
  };

  if (!workout || !currentExercise) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Treino não encontrado</p>
        </div>
      </div>
    );
  }

  const exercise = exercises[currentExercise.exerciseId];

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">{workout.nome}</h1>
          <div className="text-sm text-gray-600">
            Exercício {currentExerciseIndex + 1} de {allExercises.length} • 
            Série {currentSetIndex + 1} de {currentExercise.series.length}
          </div>
        </div>

        {/* Timer de Descanso */}
        {isResting && (
          <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">
                Descanso: {formatTime(restTimer)}
              </div>
              <button
                onClick={() => {
                  setIsResting(false);
                  setRestTimer(0);
                }}
                className="mt-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Pular Descanso
              </button>
            </div>
          </div>
        )}

        {/* Exercício Atual */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{exercise?.nome}</h2>
          {exercise?.gruposMusculares && (
            <p className="text-gray-600 mb-2">
              <strong>Músculos:</strong> {exercise.gruposMusculares.join(', ')}
            </p>
          )}
          {exercise?.equipamento && (
            <p className="text-gray-600 mb-4">
              <strong>Equipamento:</strong> {exercise.equipamento}
            </p>
          )}

          {exercise?.instrucoes && (
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h4 className="font-medium mb-2">Instruções:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                {exercise.instrucoes.map((instrucao, index) => (
                  <li key={index}>{instrucao}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Série Atual */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h3 className="font-semibold mb-2">Série {currentSetIndex + 1}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {currentSet?.reps && (
              <div><strong>Repetições:</strong> {currentSet.reps}</div>
            )}
            {currentSet?.repsMin && currentSet?.repsMax && (
              <div><strong>Repetições:</strong> {currentSet.repsMin}-{currentSet.repsMax}</div>
            )}
            {currentSet?.cargaKg && (
              <div><strong>Carga:</strong> {currentSet.cargaKg} kg</div>
            )}
            {currentSet?.tempoSeg && (
              <div><strong>Tempo:</strong> {currentSet.tempoSeg}s</div>
            )}
            {currentSet?.descansoSeg && (
              <div><strong>Descanso:</strong> {currentSet.descansoSeg}s</div>
            )}
          </div>
        </div>

        {/* Form de Registro */}
        {!isResting && (
          <SetRegistrationForm 
            plannedSet={currentSet}
            onComplete={completeSet}
          />
        )}

        {/* Progresso */}
        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <h4 className="font-medium mb-2">Progresso do Treino</h4>
          <div className="text-sm text-gray-600">
            Séries concluídas: {completedSets.length}
          </div>
        </div>
      </div>
    </div>
  );
}

function SetRegistrationForm({ 
  plannedSet, 
  onComplete 
}: { 
  plannedSet: any; 
  onComplete: (reps: number, weight: number, rpe?: number) => void;
}) {
  const [reps, setReps] = useState(plannedSet?.reps || '');
  const [weight, setWeight] = useState(plannedSet?.cargaKg || '');
  const [rpe, setRpe] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const repsNum = parseInt(reps) || 0;
    const weightNum = parseFloat(weight) || 0;
    const rpeNum = rpe ? parseInt(rpe) : undefined;
    
    onComplete(repsNum, weightNum, rpeNum);
    
    setReps('');
    setWeight('');
    setRpe('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Repetições *</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Ex: 10"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Carga (kg) *</label>
          <input
            type="number"
            step="0.5"
            className="w-full p-2 border rounded-md"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Ex: 20"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">RPE (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            className="w-full p-2 border rounded-md"
            value={rpe}
            onChange={(e) => setRpe(e.target.value)}
            placeholder="Ex: 8"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium"
      >
        Concluir Série
      </button>
    </form>
  );
}