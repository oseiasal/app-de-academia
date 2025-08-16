'use client';

import { useState, useEffect } from 'react';
import { getRepository } from '../../lib/indexeddb';
import { Exercise } from '../../lib/types';
import { GRUPOS_MUSCULARES, EQUIPAMENTOS, NIVEIS } from '../../lib/constants';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [filters, setFilters] = useState({
    muscle: '',
    equipment: '',
    level: '',
    query: ''
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [filters]);

  const fetchExercises = async () => {
    try {
      const repository = await getRepository();
      const exercisesData = await repository.searchExercises(filters);
      setExercises(exercisesData);
      setFilteredExercises(exercisesData);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Catálogo de Exercícios</h1>
        
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

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum exercício encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}