import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react'; // ⬅️ Asegúrate de tener instalado: npm install lucide-react

const QuestionViewer = ({ questions, onFinish }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [correctas, setCorrectas] = useState(0);
  const [falladas, setFalladas] = useState([]);

  const current = questions[index];

  const responder = (letra) => {
    if (selected) return;
    setSelected(letra);

    if (letra === current.respuesta) {
      setCorrectas((prev) => prev + 1);
    } else {
      setFalladas((prev) => [...prev, current]);
    }
  };

  const siguiente = () => {
    if (index + 1 >= questions.length) {
      const incorrectas = questions.length - correctas;
      onFinish(correctas, incorrectas, falladas);
    } else {
      setIndex(index + 1);
      setSelected('');
    }
  };

  const copiarPregunta = () => {
    const texto = [
      `Pregunta ${current.numero ?? index + 1}:`,
      current.enunciado,
      ...Object.entries(current.opciones).map(
        ([letra, texto]) => `${letra}. ${texto}`
      )
    ].join('\n');

    const temp = document.createElement('textarea');
    temp.value = texto;
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('❌ No se pudo copiar en este navegador:', err);
    }
    document.body.removeChild(temp);
  };

  // ⌨️ Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();

      if (!selected && ['A', 'B', 'C', 'D', 'E'].includes(key)) {
        responder(key);
      } else if (selected && e.code === 'Space') {
        e.preventDefault();
        siguiente();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, index, current]);

  return (
    <div className="bg-gray-800 p-4 rounded text-white">
      <div className="flex justify-between items-center mb-2">
        <p className="font-bold text-sm sm:text-base">
          Pregunta {index + 1} de {questions.length}
        </p>

        {/* Botón copiar elegante */}
        <button
          onClick={copiarPregunta}
          className="flex items-center gap-2 text-xs sm:text-sm text-white bg-slate-600 hover:bg-slate-500 px-3 py-1 rounded shadow-sm transition duration-150"
          title="Copiar pregunta"
        >
          <Copy size={16} />
          Copiar
        </button>
      </div>

      {/* Enunciado con número JSON */}
      <p className="mb-4 text-justify text-sm sm:text-base md:text-lg">
        <span className="font-bold text-white mr-2">{current.numero}.</span>
        {current.enunciado}
      </p>

      {/* Opciones */}
      <div className="mb-4 space-y-2">
        {Object.entries(current.opciones).map(([letra, texto]) => {
          let clase = 'bg-gray-700 hover:bg-gray-600';
          if (selected) {
            if (letra === current.respuesta) {
              clase = 'bg-green-600';
            } else if (letra === selected) {
              clase = 'bg-red-600';
            }
          }

          return (
            <button
              key={letra}
              className={`block w-full text-left p-2 rounded ${clase} text-sm sm:text-base`}
              onClick={() => responder(letra)}
              disabled={!!selected}
            >
              {letra}. {texto}
            </button>
          );
        })}
      </div>

      {/* Botón siguiente */}
      {selected && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm sm:text-base"
          onClick={siguiente}
        >
          {index + 1 === questions.length ? 'Finalizar' : 'Siguiente'}
        </button>
      )}
    </div>
  );
};

export default QuestionViewer;
