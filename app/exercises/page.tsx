'use client';

import { useState, useEffect, useCallback } from 'react';
import { getRepository } from '../../lib/indexeddb';
import { Exercise } from '../../lib/types';
import { GRUPOS_MUSCULARES, EQUIPAMENTOS, NIVEIS } from '../../lib/constants';

export default function ExercisesPage() {
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [filters, setFilters] = useState({
    muscle: '',
    equipment: '',
    level: '',
    query: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchExercises = useCallback(async () => {
    try {
      const repository = await getRepository();
      const exercisesData = await repository.searchExercises(filters);
      setFilteredExercises(exercisesData);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
    }
  }, [filters]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    fetchExercises();
    setShowCreateForm(false);
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Catálogo de Exercícios</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Novo Exercício
        </button>
      </div>

      {showCreateForm && (
        <CreateExerciseForm 
          onClose={() => setShowCreateForm(false)}
          onSave={handleSave}
        />
      )}

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Buscar</label>
          <input
            type="text"
            placeholder="Nome do exercício..."
            className="w-full p-2 border rounded-md"
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Grupo Muscular</label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.muscle}
            onChange={(e) => handleFilterChange('muscle', e.target.value)}
          >
            <option value="">Todos</option>
            {GRUPOS_MUSCULARES.map(muscle => (
              <option key={muscle} value={muscle}>{muscle}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Equipamento</label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.equipment}
            onChange={(e) => handleFilterChange('equipment', e.target.value)}
          >
            <option value="">Todos</option>
            {EQUIPAMENTOS.map(equipment => (
              <option key={equipment} value={equipment}>{equipment}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nível</label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
          >
            <option value="">Todos</option>
            {NIVEIS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Exercícios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => (
          <div key={exercise.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{exercise.nome}</h3>
              <span className={`px-2 py-1 text-xs rounded ${ 
                exercise.nivel === 'iniciante' ? 'bg-green-100 text-green-800' :
                exercise.nivel === 'intermediario' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {exercise.nivel}
              </span>
            </div>
            
            <div className="mb-2">
              <p className="text-sm text-gray-600 mb-1">
                <strong>Músculos:</strong> {exercise.gruposMusculares.join(', ')}
              </p>
              {exercise.equipamento && (
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Equipamento:</strong> {exercise.equipamento}
                </p>
              )}
            </div>

            {exercise.tags && exercise.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {exercise.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {exercise.instrucoes && exercise.instrucoes.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-1">Instruções:</h4>
                <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
                  {exercise.instrucoes.map((instrucao, index) => (
                    <li key={index}>{instrucao}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Adicionar ao Treino
              </button>
              <button className="px-4 py-2 border rounded hover:bg-gray-50">
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreateExerciseForm({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [exerciseName, setExerciseName] = useState('');
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [equipment, setEquipment] = useState('');
  const [level, setLevel] = useState<'iniciante' | 'intermediario' | 'avancado' | '' >('');
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState('');

  const handleSave = async () => {
    if (!exerciseName.trim() || muscleGroups.length === 0 || !level) return;

    const exerciseData = {
      id: `exercise-${Date.now()}`,
      nome: exerciseName,
      gruposMusculares: muscleGroups,
      equipamento: equipment || undefined,
      nivel: level,
      instrucoes: instructions.split('\n').filter(line => line.trim() !== ''),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };

    try {
      const repository = await getRepository();
      await repository.createExercise(exerciseData);
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar exercício:', error);
      alert('Erro ao criar exercício');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Novo Exercício</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Exercício *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              placeholder="Ex: Supino Reto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Grupos Musculares *</label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
              {GRUPOS_MUSCULARES.map(group => (
                <label key={group} className="flex items-center p-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    className="mr-3"
                    checked={muscleGroups.includes(group)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMuscleGroups(prev => [...prev, group]);
                      } else {
                        setMuscleGroups(prev => prev.filter(g => g !== group));
                      }
                    }}
                  />
                  {group}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Equipamento</label>
            <select
              className="w-full p-2 border rounded-md"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
            >
              <option value="">Nenhum</option>
              {EQUIPAMENTOS.map(equipment => (
                <option key={equipment} value={equipment}>{equipment}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nível *</label>
            <select
              className="w-full p-2 border rounded-md"
              value={level}
              onChange={(e) => setLevel(e.target.value as 'iniciante' | 'intermediario' | 'avancado' | '')}
            >
              <option value="">Selecione</option>
              {NIVEIS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Instruções (uma por linha)</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ex: Supino Reto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (separadas por vírgula)</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ex: força, hipertrofia"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            disabled={!exerciseName.trim() || muscleGroups.length === 0 || !level}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-300"
          >
            Criar Exercício
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
