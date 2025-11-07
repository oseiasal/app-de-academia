'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getRepository } from '../../../../lib/indexeddb';
import { Workout, Exercise } from '../../../../lib/types';

export default function PrintWorkoutPage() {
  const params = useParams();
  const workoutId = params.id as string;
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Record<string, Exercise>>({});

  const fetchWorkoutData = useCallback(async () => {
    try {
      const repository = await getRepository();
      const workoutData = await repository.getWorkoutById(workoutId);
      
      if (!workoutData) {
        console.error('Treino não encontrado');
        return;
      }
      
      setWorkout(workoutData);
      
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
  }, [workoutId]);

  useEffect(() => {
    fetchWorkoutData();
  }, [fetchWorkoutData]);

  useEffect(() => {
    // Auto-imprimir quando a página carrega (opcional)
    if (workout && Object.keys(exercises).length > 0) {
      // Remover auto-print para permitir visualização primeiro
      // setTimeout(() => { window.print(); }, 500);
    }
  }, [workout, exercises]);

  if (!workout) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
        }
        
        @page {
          margin: 15mm;
          size: A4;
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-6 bg-white">
        {/* Botões de controle - ocultos na impressão */}
        <div className="no-print mb-6 flex gap-4">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🖨️ Imprimir
          </button>
          <button
            onClick={() => window.close()}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>

        {/* Cabeçalho da ficha */}
        <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            {workout.nome || 'Ficha de Treino'}
          </h1>
          <p className="text-gray-600">App de Academia - Ficha de Treino</p>
        </div>

        {/* Informações do treino */}
        <div className="grid grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded">
          <div>
            <div className="text-xs font-bold text-gray-600 uppercase">Data</div>
            <div className="text-sm border-b border-gray-300 pb-1">
              {workout.dataPlanejada ? new Date(workout.dataPlanejada).toLocaleDateString('pt-BR') : '__/__/__'}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-600 uppercase">Aluno</div>
            <div className="text-sm border-b border-gray-300 pb-1">
              _________________________
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-600 uppercase">Peso</div>
            <div className="text-sm border-b border-gray-300 pb-1">
              _______ kg
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-600 uppercase">Início</div>
            <div className="text-sm border-b border-gray-300 pb-1">
              __:__
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-600 uppercase">Fim</div>
            <div className="text-sm border-b border-gray-300 pb-1">
              __:__
            </div>
          </div>
        </div>

        {/* Blocos de exercícios */}
        {workout.blocos.map((bloco, blocoIndex) => (
          <div key={blocoIndex} className="mb-6">
            <div className="bg-blue-600 text-white px-4 py-2 font-bold uppercase text-sm rounded-t">
              {bloco.tipo}
            </div>
            
            {bloco.exercicios.map((exercicio, exercicioIndex) => {
              const exercise = exercises[exercicio.exerciseId];
              if (!exercise) return null;

              return (
                <div key={exercicioIndex} className="border border-t-0 border-gray-300 p-4">
                  {/* Cabeçalho do exercício */}
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-lg font-bold">{exercise.nome}</h3>
                      <div className="text-sm text-gray-600">
                        {exercise.equipamento && `Equipamento: ${exercise.equipamento} • `}
                        Nível: {exercise.nivel}
                      </div>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded text-xs">
                      {exercise.gruposMusculares.join(', ')}
                    </div>
                  </div>

                  {/* Tabela de séries */}
                  <table className="w-full border-collapse mb-3">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-xs font-bold w-12">Série</th>
                        <th className="border border-gray-300 p-2 text-xs font-bold">Repetições</th>
                        <th className="border border-gray-300 p-2 text-xs font-bold">Carga (kg)</th>
                        <th className="border border-gray-300 p-2 text-xs font-bold">RPE</th>
                        <th className="border border-gray-300 p-2 text-xs font-bold">Descanso</th>
                        <th className="border border-gray-300 p-2 text-xs font-bold w-16">✓ Feito</th>
                        <th className="border border-gray-300 p-2 text-xs font-bold">Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercicio.series.map((serie, serieIndex) => (
                        <tr key={serieIndex}>
                          <td className="border border-gray-300 p-3 text-center font-bold bg-blue-50">
                            {serieIndex + 1}
                          </td>
                          <td className="border border-gray-300 p-3 text-center">
                            {serie.reps || 
                             (serie.repsMin && serie.repsMax ? `${serie.repsMin}-${serie.repsMax}` : '____')}
                          </td>
                          <td className="border border-gray-300 p-3 text-center">
                            {serie.cargaKg || '____'}
                          </td>
                          <td className="border border-gray-300 p-3 text-center">
                            ____
                          </td>
                          <td className="border border-gray-300 p-3 text-center">
                            {serie.descansoSeg ? `${Math.floor(serie.descansoSeg / 60)}min` : '____'}
                          </td>
                          <td className="border border-gray-300 p-3 text-center">
                            <div className="w-4 h-4 border-2 border-gray-400 inline-block"></div>
                          </td>
                          <td className="border border-gray-300 p-3" style={{borderLeft: '3px solid #f3f4f6'}}>
                            
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Instruções */}
                  {exercise.instrucoes && exercise.instrucoes.length > 0 && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
                      <div className="text-xs font-bold text-yellow-800 mb-2 uppercase">
                        Instruções de Execução:
                      </div>
                      <ol className="text-xs text-yellow-900 space-y-1">
                        {exercise.instrucoes.map((instrucao, index) => (
                          <li key={index} className="list-decimal list-inside">
                            {instrucao}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Observações do exercício */}
                  {exercicio.observacoes && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                      <div className="text-xs font-bold text-blue-800 mb-1 uppercase">
                        Observações:
                      </div>
                      <div className="text-xs text-blue-900">{exercicio.observacoes}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Notas gerais */}
        {workout.notas && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="text-sm font-bold text-blue-800 mb-2 uppercase">
              Notas Gerais do Treino:
            </div>
            <div className="text-sm text-blue-900">{workout.notas}</div>
          </div>
        )}

        {/* Rodapé */}
        <div className="text-center text-xs text-gray-500 border-t pt-4 mt-8">
          Gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')} • App de Academia
        </div>
      </div>
    </>
  );
}