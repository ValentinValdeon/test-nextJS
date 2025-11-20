"use client";
import { useState } from 'react';

export default function FormularioPersona() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nacimiento, setNacimiento] = useState('');
  const [dni, setDni] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false); // Estado para manejar la carga

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('Enviando datos...'); // Notificar al usuario

    // 1. Crear el objeto de datos
    const dataToSend = {
      nombre,
      apellido,
      nacimiento,
      // Se recomienda convertir DNI a número si en la base de datos es INT o BIGINT
      dni: Number(dni), 
    };

    try {
      // 2. Realizar la petición POST
      const res = await fetch('/api/persona', { // Asume que el route.js está en /api/persona
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      // 3. Manejar la respuesta del servidor
      if (res.ok) {
        // Éxito (Status 201)
        const result = await res.json();
        console.log('Persona creada:', result.data);
        setMensaje('✅ Persona guardada exitosamente.');
        
        // Limpiar formulario
        setNombre('');
        setApellido('');
        setNacimiento('');
        setDni('');

      } else {
        // Error del servidor (Status 400 o 500)
        const errorData = await res.json();
        console.error('Error del servidor:', errorData);
        setMensaje(`❌ Error al guardar: ${errorData.error || res.statusText}`);
      }

    } catch (error) {
      // Error de red, conexión, etc.
      console.error('Error de conexión o desconocido:', error);
      setMensaje('❌ Error de conexión con el servidor. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
      // Ocultar el mensaje después de 3 segundos si no es un error persistente
      if (mensaje.startsWith('✅')) {
         setTimeout(() => setMensaje(''), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Cargar Persona
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ... Tus inputs (Nombre, Apellido, Nacimiento, DNI) permanecen iguales ... */}
          
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none" placeholder="Ingresa el nombre" required disabled={cargando} />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none" placeholder="Ingresa el apellido" required disabled={cargando} />
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
            <input type="date" value={nacimiento} onChange={(e) => setNacimiento(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none" required disabled={cargando} />
          </div>

          {/* DNI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
            <input type="number" value={dni} onChange={(e) => setDni(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none" placeholder="Ingresa el DNI" required disabled={cargando} />
          </div>

          <button
            type="submit"
            disabled={cargando} // Deshabilita el botón mientras carga
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:bg-indigo-400"
          >
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
        </form>

        {mensaje && (
          <div className={`mt-6 p-4 rounded-lg ${mensaje.startsWith('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-center font-medium ${mensaje.startsWith('✅') ? 'text-green-700' : 'text-red-700'}`}>{mensaje}</p>
          </div>
        )}
      </div>
    </div>
  );
}