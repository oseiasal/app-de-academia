'use client';

import { useState } from 'react';
import { getRepository } from '../../lib/indexeddb';
import { WORKOUT_TEMPLATES, WorkoutTemplate } from '../../lib/workout-templates';

export default function TemplatesPage() {
  const [selectedObjective, setSelectedObjective] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const filteredTemplates = WORKOUT_TEMPLATES.filter(template => {
    if (selectedObjective && template.objetivo !== selectedObjective) return false;
    if (selectedLevel && template.nivel !== selectedLevel) return false;
    return true;
  });

  const handleUseTemplate = async (template: WorkoutTemplate) => {
    try {
      const repository = await getRepository();
      
      const workoutData = {
        ...template.workout,
        id: `workout-${Date.now()}`,
        dataPlanejada: new Date().toISOString().split('T')[0] // Hoje
      };

      await repository.createWorkout(workoutData);
      alert(`Treino "${template.nome}" adicionado aos seus treinos!`);
      
      // Redirecionar para página de treinos
      window.location.href = '/workouts';
    } catch (error) {
      console.error('Erro ao usar template:', error);
      alert('Erro ao adicionar treino');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Catálogo de Treinos Prontos</h1>
        <p className="text-gray-600">
          Escolha entre treinos pré-montados por especialistas, organizados por objetivo e nível.
        </p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Objetivo</label>
          <select
            value={selectedObjective}
            onChange={(e) => setSelectedObjective(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Todos os objetivos</option>
            <option value="hipertrofia">Hipertrofia</option>
            <option value="força">Força</option>
            <option value="resistência">Resistência</option>
            <option value="cardio">Cardio</option>
            <option value="saúde">Saúde Geral</option>
            <option value="rehab">Reabilitação</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nível</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Todos os níveis</option>
            <option value="iniciante">Iniciante</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
        </div>
      </div>

      {/* Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map(template => (
          <TemplateCard 
            key={template.id} 
            template={template} 
            onUse={() => handleUseTemplate(template)} 
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum template encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}

function TemplateCard({ 
  template, 
  onUse 
}: { 
  template: WorkoutTemplate; 
  onUse: () => void; 
}) {
  const [showDetails, setShowDetails] = useState(false);
  
  const totalExercises = template.workout.blocos.reduce(
    (sum, bloco) => sum + bloco.exercicios.length, 0
  );

  const getObjectiveColor = (objetivo: string) => {
    switch (objetivo) {
      case 'hipertrofia': return 'bg-purple-100 text-purple-800';
      case 'força': return 'bg-red-100 text-red-800';
      case 'resistência': return 'bg-orange-100 text-orange-800';
      case 'cardio': return 'bg-green-100 text-green-800';
      case 'saúde': return 'bg-blue-100 text-blue-800';
      case 'rehab': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (nivel: string) => {
    switch (nivel) {
      case 'iniciante': return 'bg-green-100 text-green-800';
      case 'intermediario': return 'bg-yellow-100 text-yellow-800';
      case 'avancado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold">{template.nome}</h3>
        <div className="flex gap-2">
          <span className={`px-2 py-1 text-xs rounded ${getObjectiveColor(template.objetivo)}`}>
            {template.objetivo}
          </span>
          <span className={`px-2 py-1 text-xs rounded ${getLevelColor(template.nivel)}`}>
            {template.nivel}
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{template.descricao}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="font-medium">Duração:</span> {template.duracaoMinutos} min
        </div>
        <div>
          <span className="font-medium">Frequência:</span> {template.frequenciaSemanal}x/semana
        </div>
        <div>
          <span className="font-medium">Exercícios:</span> {totalExercises}
        </div>
        <div>
          <span className="font-medium">Blocos:</span> {template.workout.blocos.length}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {template.workout.blocos.map((bloco, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {bloco.tipo}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onUse}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Usar Template
        </button>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          {showDetails ? 'Ocultar' : 'Detalhes'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-3">Estrutura do Treino:</h4>
          {template.workout.blocos.map((bloco, blocoIndex) => (
            <div key={blocoIndex} className="mb-3">
              <div className="font-medium text-sm uppercase text-gray-700 mb-1">
                {bloco.tipo}
              </div>
              {bloco.exercicios.map((exercicio, exercicioIndex) => (
                <div key={exercicioIndex} className="ml-4 text-sm text-gray-600 mb-1">
                  • Exercício ID: {exercicio.exerciseId} ({exercicio.series.length} séries)
                  {exercicio.observacoes && (
                    <div className="text-xs text-gray-500 ml-2">
                      &quot;{exercicio.observacoes}&quot;
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          
          {template.workout.notas && (
            <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
              <strong>Notas:</strong> {template.workout.notas}
            </div>
          )}
        </div>
      )}
    </div>
  );
}