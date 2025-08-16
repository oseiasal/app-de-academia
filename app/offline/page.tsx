export default function OfflinePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📱</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Você está offline
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Não se preocupe! O App de Academia funciona offline.
        </p>
        
        <div className="bg-blue-50 p-6 rounded-lg max-w-md mx-auto">
          <h2 className="font-semibold mb-3">O que você pode fazer offline:</h2>
          <ul className="text-left text-gray-700 space-y-2">
            <li>✅ Executar treinos salvos</li>
            <li>✅ Registrar séries e repetições</li>
            <li>✅ Ver histórico de treinos</li>
            <li>✅ Consultar catálogo de exercícios</li>
            <li>✅ Criar novos treinos</li>
          </ul>
          <div className="mt-4 text-sm text-gray-600">
            Seus dados serão sincronizados automaticamente quando você voltar online.
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}