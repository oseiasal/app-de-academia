'use client';

import { useState, useEffect } from 'react';
import { getRepository } from '../../lib/indexeddb';
import { Workout, Exercise } from '../../lib/types';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const repository = await getRepository();
      const workoutsData = await repository.getAllWorkouts();
      setWorkouts(workoutsData);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    }
  };

  const refreshWorkouts = () => {
    fetchWorkouts();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meus Treinos</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Novo Treino
        </button>
      </div>

      {showCreateForm && (
        <CreateWorkoutForm 
          onClose={() => setShowCreateForm(false)}
          onSave={refreshWorkouts}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map(workout => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>

      {workouts.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Você ainda não criou nenhum treino.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Criar Primeiro Treino
          </button>
        </div>
      )}
    </div>
  );
}

function WorkoutCard({ workout }: { workout: Workout }) {
  const totalExercises = workout.blocos.reduce((sum, bloco) => sum + bloco.exercicios.length, 0);
  
  const handlePrintPDF = () => {
    const printUrl = `/workouts/${workout.id}/print`;
    window.open(printUrl, '_blank');
  };
  
  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{workout.nome || 'Treino sem nome'}</h3>
        {workout.dataPlanejada && (
          <span className="text-sm text-gray-500">
            {new Date(workout.dataPlanejada).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-gray-600 mb-1">
          <strong>Blocos:</strong> {workout.blocos.length}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Exercícios:</strong> {totalExercises}
        </p>
        <div className="flex flex-wrap gap-1">
          {workout.blocos.map((bloco, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              {bloco.tipo}
            </span>
          ))}
        </div>
      </div>

      {workout.notas && (
        <p className="text-sm text-gray-600 mb-3">{workout.notas}</p>
      )}

      <div className="flex gap-2 mb-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Executar
        </button>
        <button className="px-4 py-2 border rounded hover:bg-gray-50">
          Editar
        </button>
      </div>
      
      <button 
        onClick={handlePrintPDF}
        className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 text-sm"
      >
        📄 Imprimir PDF
      </button>
    </div>
  );
}

function CreateWorkoutForm({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const repository = await getRepository();
      const exercisesData = await repository.getAllExercises();
      setExercises(exercisesData);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
    }
  };

  const handleSave = async () => {
    if (!workoutName.trim()) return;

    const workoutData = {
      id: `workout-${Date.now()}`,
      nome: workoutName,
      dataPlanejada: selectedDate || undefined,
      blocos: [{
        tipo: 'principal',
        exercicios: selectedExercises.map(exerciseId => ({
          exerciseId,
          series: [{
            tipoSerie: 'padrão',
            reps: 10,
            cargaKg: 20,
            descansoSeg: 90
          }]
        }))
      }],
      notas: notes || undefined
    };

    try {
      const repository = await getRepository();
      await repository.createWorkout(workoutData);
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      alert('Erro ao criar treino');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Novo Treino</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Treino *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Ex: Peito e Tríceps A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data Planejada</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Exercícios</label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
              {exercises.map(exercise => (
                <label key={exercise.id} className="flex items-center p-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    className="mr-3"
                    checked={selectedExercises.includes(exercise.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedExercises(prev => [...prev, exercise.id]);
                      } else {
                        setSelectedExercises(prev => prev.filter(id => id !== exercise.id));
                      }
                    }}
                  />
                  <div>
                    <div className="font-medium">{exercise.nome}</div>
                    <div className="text-sm text-gray-600">{exercise.gruposMusculares.join(', ')}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notas</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre o treino..."
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            disabled={!workoutName.trim()}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-300"
          >
            Criar Treino
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}