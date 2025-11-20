"use client";

import { useEffect, useState } from "react";

export default function TablaPersonas() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarPersonas = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/persona");
      const data = await res.json();
      setPersonas(data);
    } catch (error) {
      console.error("Error al cargar personas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white">
              Listado de Personas
            </h2>
            <p className="text-indigo-100 mt-1">
              {personas.length} {personas.length === 1 ? 'persona registrada' : 'personas registradas'}
            </p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : personas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No hay personas registradas</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Apellido
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nacimiento
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      DNI
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {personas.map((p: any, index: number) => (
                    <tr 
                      key={p.id}
                      className="hover:bg-indigo-50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                          {p.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900 font-medium">{p.nombre}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900 font-medium">{p.apellido}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600">{p.nacimiento}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {p.dni}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <button
              onClick={cargarPersonas}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}