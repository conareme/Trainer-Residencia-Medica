import React from 'react';

const FileSelector = ({ onSelect }) => {
  const archivosContexto = require.context('../data', false, /\.json$/);
  const archivos = archivosContexto.keys().map((ruta) =>
    ruta.replace('./', '')
  );

  return (
    <div className="bg-gray-800 p-4 rounded text-white">
      <h2 className="text-base sm:text-lg font-bold mb-4">Selecciona un archivo</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {archivos.map((archivo) => (
          <button
            key={archivo}
            onClick={() => onSelect(archivo)}
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded shadow text-left transition duration-200"
          >
            <h3 className="text-base font-semibold text-sky-300 truncate">
              {archivo.replace('.json', '')}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FileSelector;
