import React, { useState, useEffect } from 'react';
import FileSelector from './components/FileSelector';
import QuestionViewer from './components/QuestionViewer';
import { CheckCircle, XCircle, Sigma, ListTodo, Home } from 'lucide-react';

function muestreoSinReemplazo(lista, cantidad) {
  const copia = [...lista];
  const seleccionadas = [];
  for (let i = 0; i < cantidad && copia.length > 0; i++) {
    const index = Math.floor(Math.random() * copia.length);
    seleccionadas.push(copia.splice(index, 1)[0]);
  }
  return seleccionadas;
}

function App() {
  const [file, setFile] = useState('');
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [questions, setQuestions] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [resultados, setResultados] = useState(null);
  const [respondidas, setRespondidas] = useState([]);
  const [erroresPendientes, setErroresPendientes] = useState([]);

  useEffect(() => {
    if (file) {
      import(`./data/${file}`).then((data) => {
        const todas = data.default;
        setOriginalQuestions(todas);
        setAvailableQuestions(todas);
        setRespondidas([]);
        setQuestions(null);
        setResultados(null);
        setErroresPendientes([]);
      });
    }
  }, [file]);

  const comenzar = () => {
    const cantidadInt = parseInt(cantidad, 10);
    if (isNaN(cantidadInt) || cantidadInt < 1 || cantidadInt > availableQuestions.length) {
      alert(`Ingresa un número entre 1 y ${availableQuestions.length}`);
      return;
    }

    const seleccionadas = muestreoSinReemplazo(availableQuestions, cantidadInt);
    const nuevasIds = seleccionadas.map((q) => q.numero);
    const nuevasDisponibles = availableQuestions.filter((q) => !nuevasIds.includes(q.numero));

    setQuestions(seleccionadas);
    setAvailableQuestions(nuevasDisponibles);
    setRespondidas((prev) => [...prev, ...seleccionadas]);
    setResultados(null);
    setErroresPendientes([]);
  };

  const handleFinish = (correctas, incorrectas, falladas = []) => {
    setQuestions(null);
    setResultados({ correctas, incorrectas });
    setErroresPendientes(falladas);
  };

  const volverInicio = () => {
    setFile('');
    setOriginalQuestions([]);
    setAvailableQuestions([]);
    setQuestions(null);
    setCantidad('');
    setResultados(null);
    setRespondidas([]);
    setErroresPendientes([]);
  };

  const volverAElegirCantidad = () => {
    setQuestions(null);
    setResultados(null);
    setCantidad('');
    setErroresPendientes([]);
  };

  const reintentarErrores = () => {
    setQuestions(erroresPendientes);
    setErroresPendientes([]);
    setResultados(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 relative">

      {/* Encabezado con botón "Inicio" visible solo durante preguntas */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-200 tracking-wide drop-shadow-lg">
          Trainer Residencia Médica
        </h1>

        {questions && (
          <button
            onClick={volverInicio}
            className="ml-4 p-1.5 bg-green-600 hover:bg-green-700 rounded-full shadow-md"
            title="Volver al inicio"
          >
            <Home size={18} className="text-white" />
          </button>
        )}
      </div>

      {!file && <FileSelector onSelect={setFile} />}

      {file && !questions && !resultados && (
        <div className="mb-4">
          <p className="mb-4 text-base sm:text-lg text-indigo-300 font-medium tracking-wide">
            Preguntas disponibles: <span className="font-bold">{availableQuestions.length}</span>
          </p>

          <label className="block mb-2">¿Cuántas preguntas deseas?</label>
          <div className="flex gap-2 flex-wrap mb-4">
            {[5, 10, 20, 50].map((n) =>
              n <= availableQuestions.length ? (
                <button
                  key={n}
                  className={`px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 ${
                    parseInt(cantidad) === n ? 'ring-2 ring-amber-300' : ''
                  }`}
                  onClick={() => setCantidad(n)}
                >
                  {n}
                </button>
              ) : null
            )}
          </div>

          {cantidad && (
            <>
              <button
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                onClick={comenzar}
              >
                Comenzar
              </button>
              <p className="mt-2 text-xs text-gray-400 hidden md:block">
                Puedes usar el teclado: A–E para responder, barra espaciadora para avanzar.
              </p>
            </>
          )}
        </div>
      )}

      {questions && (
        <QuestionViewer
          questions={questions}
          onFinish={handleFinish}
        />
      )}

      {resultados && (
        <div className="bg-gray-800 p-6 rounded text-white">
          <h2 className="text-4xl font-bold mb-8">Resumen</h2>

          <div className="space-y-3 text-2xl font-semibold">
            <p className="flex items-center gap-3 text-green-400">
              <CheckCircle size={40} /> Aciertos: {resultados.correctas}
            </p>
            <p className="flex items-center gap-3 text-red-400">
              <XCircle size={40} /> Errores: {resultados.incorrectas}
            </p>
            <p className="flex items-center gap-3 text-blue-400">
              <Sigma size={40} /> Total: {resultados.correctas + resultados.incorrectas}
            </p>
            <p className="flex items-center gap-3 text-amber-300 mt-2">
              <ListTodo size={40} /> Restantes: {availableQuestions.length}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-start gap-2 sm:gap-4">
            {/* Reintentar errores (si hay) */}
            {erroresPendientes.length > 0 && (
              <button
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded w-1/2 sm:w-auto"
                onClick={reintentarErrores}
              >
                Reintentar
              </button>
            )}

            {/* Continuar solo si hay preguntas restantes */}
            {availableQuestions.length > 0 && (
              <button
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-1/2 sm:w-auto"
                onClick={volverAElegirCantidad}
              >
                Continuar
              </button>
            )}

            <button
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-1/2 sm:w-auto"
              onClick={volverInicio}
            >
              Inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
