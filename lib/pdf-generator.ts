import { Workout, Exercise } from './types';

export interface WorkoutPDFData {
  workout: Workout;
  exercises: Record<string, Exercise>;
  userInfo?: {
    nome?: string;
    peso?: number;
    altura?: number;
  };
}

export function generateWorkoutPDF(data: WorkoutPDFData): string {
  const { workout, exercises, userInfo } = data;
  
  // Gerar HTML estruturado para impressão em PDF
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ficha de Treino - ${workout.nome || 'Sem nome'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          background: white;
        }
        
        .page {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        
        .header h1 {
          font-size: 24px;
          color: #2563eb;
          margin-bottom: 5px;
        }
        
        .header .subtitle {
          color: #666;
          font-size: 14px;
        }
        
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 5px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
        }
        
        .info-label {
          font-weight: bold;
          color: #374151;
          font-size: 10px;
          text-transform: uppercase;
        }
        
        .info-value {
          font-size: 14px;
          color: #111827;
        }
        
        .block {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        
        .block-header {
          background: #2563eb;
          color: white;
          padding: 8px 12px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 14px;
          border-radius: 5px 5px 0 0;
        }
        
        .exercise {
          border: 1px solid #e5e7eb;
          border-top: none;
          padding: 15px;
          page-break-inside: avoid;
        }
        
        .exercise:last-child {
          border-radius: 0 0 5px 5px;
        }
        
        .exercise-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .exercise-name {
          font-size: 16px;
          font-weight: bold;
          color: #111827;
        }
        
        .exercise-details {
          font-size: 11px;
          color: #6b7280;
        }
        
        .muscle-groups {
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 10px;
          color: #374151;
        }
        
        .sets-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        
        .sets-table th {
          background: #f9fafb;
          border: 1px solid #d1d5db;
          padding: 8px;
          text-align: center;
          font-weight: bold;
          font-size: 11px;
          color: #374151;
        }
        
        .sets-table td {
          border: 1px solid #d1d5db;
          padding: 12px 8px;
          text-align: center;
          font-size: 12px;
        }
        
        .sets-table .set-number {
          background: #eff6ff;
          font-weight: bold;
        }
        
        .instructions {
          margin-top: 10px;
          padding: 10px;
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          border-radius: 0 5px 5px 0;
        }
        
        .instructions-title {
          font-weight: bold;
          font-size: 11px;
          color: #92400e;
          margin-bottom: 5px;
        }
        
        .instructions-list {
          font-size: 10px;
          color: #451a03;
        }
        
        .instructions-list li {
          margin-bottom: 3px;
        }
        
        .notes {
          margin-top: 20px;
          padding: 10px;
          background: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          border-radius: 0 5px 5px 0;
        }
        
        .notes-title {
          font-weight: bold;
          font-size: 12px;
          color: #0c4a6e;
          margin-bottom: 5px;
        }
        
        .checkbox {
          width: 15px;
          height: 15px;
          border: 2px solid #d1d5db;
          display: inline-block;
          margin-right: 5px;
        }
        
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #9ca3af;
          font-size: 10px;
          border-top: 1px solid #e5e7eb;
          padding-top: 10px;
        }
        
        @media print {
          .page {
            width: auto;
            height: auto;
            margin: 0;
            padding: 15mm;
            box-shadow: none;
          }
          
          body {
            font-size: 11px;
          }
          
          .header h1 {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <!-- Cabeçalho -->
        <div class="header">
          <h1>${workout.nome || 'Ficha de Treino'}</h1>
          <div class="subtitle">App de Academia - Ficha de Treino</div>
        </div>
        
        <!-- Informações do Treino -->
        <div class="info-section">
          <div class="info-item">
            <span class="info-label">Data</span>
            <span class="info-value">${workout.dataPlanejada ? new Date(workout.dataPlanejada).toLocaleDateString('pt-BR') : '__/__/__'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Aluno</span>
            <span class="info-value">${userInfo?.nome || '________________________'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Peso</span>
            <span class="info-value">${userInfo?.peso ? userInfo.peso + ' kg' : '______ kg'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Hora Início</span>
            <span class="info-value">__:__</span>
          </div>
          <div class="info-item">
            <span class="info-label">Hora Fim</span>
            <span class="info-value">__:__</span>
          </div>
        </div>

        ${workout.blocos.map(bloco => `
          <div class="block">
            <div class="block-header">${bloco.tipo.toUpperCase()}</div>
            ${bloco.exercicios.map(exercicio => {
              const exercise = exercises[exercicio.exerciseId];
              if (!exercise) return '';
              
              return `
                <div class="exercise">
                  <div class="exercise-header">
                    <div>
                      <div class="exercise-name">${exercise.nome}</div>
                      <div class="exercise-details">
                        ${exercise.equipamento ? `Equipamento: ${exercise.equipamento} • ` : ''}
                        Nível: ${exercise.nivel}
                      </div>
                    </div>
                    <div class="muscle-groups">
                      ${exercise.gruposMusculares.join(', ')}
                    </div>
                  </div>
                  
                  <table class="sets-table">
                    <thead>
                      <tr>
                        <th style="width: 40px;">Série</th>
                        <th style="width: 80px;">Repetições</th>
                        <th style="width: 80px;">Carga (kg)</th>
                        <th style="width: 70px;">RPE</th>
                        <th style="width: 80px;">Descanso</th>
                        <th style="width: 60px;">✓ Feito</th>
                        <th>Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${exercicio.series.map((serie, index) => `
                        <tr>
                          <td class="set-number">${index + 1}</td>
                          <td>
                            ${serie.reps ? serie.reps : 
                              serie.repsMin && serie.repsMax ? `${serie.repsMin}-${serie.repsMax}` : 
                              '____'}
                          </td>
                          <td>${serie.cargaKg || '____'}</td>
                          <td>____</td>
                          <td>${serie.descansoSeg ? Math.floor(serie.descansoSeg / 60) + 'min' : '____'}</td>
                          <td><div class="checkbox"></div></td>
                          <td style="border-left: 2px solid #f3f4f6;"></td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                  
                  ${exercise.instrucoes && exercise.instrucoes.length > 0 ? `
                    <div class="instructions">
                      <div class="instructions-title">Instruções de Execução:</div>
                      <ol class="instructions-list">
                        ${exercise.instrucoes.map(instrucao => `<li>${instrucao}</li>`).join('')}
                      </ol>
                    </div>
                  ` : ''}
                  
                  ${exercicio.observacoes ? `
                    <div class="notes">
                      <div class="notes-title">Observações:</div>
                      <div>${exercicio.observacoes}</div>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        `).join('')}
        
        ${workout.notas ? `
          <div class="notes">
            <div class="notes-title">Notas Gerais do Treino:</div>
            <div>${workout.notas}</div>
          </div>
        ` : ''}
        
        <div class="footer">
          Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} • App de Academia
        </div>
      </div>
    </body>
    </html>
  `;
  
  return html;
}