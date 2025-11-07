import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bem-vindo ao App de Academia
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sua plataforma completa para treinos personalizados
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-3">Catálogo de Exercícios</h3>
            <p className="text-gray-600 mb-4">
              Explore nossa biblioteca completa de exercícios
            </p>
            <Link 
              href="/exercises"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ver Exercícios
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-3">Treinos Prontos</h3>
            <p className="text-gray-600 mb-4">
              Templates por objetivo criados por especialistas
            </p>
            <Link 
              href="/templates"
              className="inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Ver Templates
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-3">Meus Treinos</h3>
            <p className="text-gray-600 mb-4">
              Crie e gerencie seus treinos personalizados
            </p>
            <Link 
              href="/workouts"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Meus Treinos
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-3">Calendário</h3>
            <p className="text-gray-600 mb-4">
              Acompanhe seu cronograma de treinos
            </p>
            <Link 
              href="/calendar"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Ver Agenda
            </Link>
          </div>
        </div>

        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Recursos Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium">Templates Prontos</div>
              <div className="text-gray-600">Por objetivo e nível</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Offline First</div>
              <div className="text-gray-600">Funciona sem internet</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Import/Export</div>
              <div className="text-gray-600">Backup em JSON</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Progressão</div>
              <div className="text-gray-600">Acompanhe sua evolução</div>
            </div>
            <div className="text-center">
              <div className="font-medium">PDF para Impressão</div>
              <div className="text-gray-600">Fichas para academia</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Comece Agora</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/templates"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium"
            >
              🏃‍♂️ Usar Treino Pronto
            </Link>
            <Link 
              href="/workouts"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              ⚡ Criar Treino Personalizado
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
