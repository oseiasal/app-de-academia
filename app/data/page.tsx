'use client';

import { useState } from 'react';
import { getRepository } from '../../lib/indexeddb';

export default function DataPage() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [selectedScope, setSelectedScope] = useState('all');

  const handleExport = async () => {
    setExporting(true);
    try {
      const repository = await getRepository();
      const data = await repository.exportData(selectedScope as any);
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `academia-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Erro ao exportar dados');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (file: File) => {
    setImporting(true);
    setImportResult(null);
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const repository = await getRepository();
      const result = await repository.importData(data);
      
      setImportResult({
        success: result.success,
        errors: result.errors,
        message: result.success ? 'Dados importados com sucesso!' : 'Erro na importação',
        imported: {
          exercises: data.catalog?.length || 0,
          workouts: data.workouts?.length || 0,
          logs: data.logs?.length || 0
        }
      });

      if (result.success) {
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      setImportResult({
        success: false,
        errors: ['Arquivo JSON inválido ou corrompido']
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Import/Export de Dados</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exportar */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Exportar Dados</h2>
          <p className="text-gray-600 mb-4">
            Faça backup dos seus dados em formato JSON. Compatível com LGPD para portabilidade.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Escopo da Exportação</label>
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">Todos os dados</option>
              <option value="catalog">Apenas catálogo</option>
              <option value="workouts">Apenas treinos</option>
              <option value="logs">Apenas histórico</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            {exporting ? 'Exportando...' : 'Exportar Dados'}
          </button>
        </div>

        {/* Importar */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Importar Dados</h2>
          <p className="text-gray-600 mb-4">
            Restaure seus dados de um arquivo JSON exportado anteriormente.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Arquivo JSON</label>
            <input
              type="file"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImport(file);
              }}
              className="w-full p-2 border rounded-md"
              disabled={importing}
            />
            <div className="mt-2 text-xs text-gray-600">
              <a 
                href="/exemplo-import.json" 
                download
                className="text-blue-600 hover:underline"
              >
                📥 Baixar arquivo de exemplo
              </a>
            </div>
          </div>

          {importing && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="text-yellow-700">Processando arquivo...</p>
            </div>
          )}

          {importResult && (
            <div className={`border-l-4 p-4 mb-4 ${
              (importResult.success !== false && !importResult.error) ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
            }`}>
              {(importResult.success !== false && !importResult.error) ? (
                <div>
                  <p className="text-green-700 font-medium">
                    {importResult.message || 'Importação realizada com sucesso!'}
                  </p>
                  {importResult.imported && (
                    <div className="text-sm text-green-600 mt-2">
                      <p>Exercícios: {importResult.imported.exercises}</p>
                      <p>Treinos: {importResult.imported.workouts}</p>
                      <p>Logs: {importResult.imported.logs}</p>
                    </div>
                  )}
                  <p className="text-sm text-green-600 mt-2">A página será recarregada em instantes...</p>
                </div>
              ) : (
                <div>
                  <p className="text-red-700 font-medium">Erro na importação:</p>
                  <ul className="text-sm text-red-600 mt-2 list-disc list-inside">
                    {importResult.errors?.map((error: string, index: number) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Formato dos Dados</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• <strong>Catálogo:</strong> exercícios com instruções, grupos musculares e equipamentos</p>
          <p>• <strong>Treinos:</strong> estrutura de blocos, exercícios e séries planejadas</p>
          <p>• <strong>Histórico:</strong> logs de execução com séries realizadas e métricas</p>
          <p>• <strong>Compatibilidade:</strong> JSON Schema validado, versionado e compatível com LGPD</p>
        </div>
      </div>
    </div>
  );
}