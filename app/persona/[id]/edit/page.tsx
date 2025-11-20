"use client";
import { useState, useEffect } from 'react';
// Importamos useParams para acceder al ID de la URL
import { useParams } from 'next/navigation';

// Define el tipo para los datos de la persona
interface PersonaData {
  nombre: string;
  apellido: string;
  nacimiento: string; // Formato YYYY-MM-DD para el input date
  dni: string;
}

export default function FormularioPersonaEdit() {
  // 1. Obtener el ID dinámico de la URL
  const params = useParams();
  const id = params.id as string; 
  console.log("ID obtenido de la URL:", id);
  const [persona, setPersona] = useState<PersonaData>({
    nombre: '',
    apellido: '',
    nacimiento: '',
    dni: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);


  // --- FUNCIÓN PARA CARGAR DATOS INICIALES (REAL) ---
  useEffect(() => {
    // Si no hay ID en la URL (aunque la estructura debería garantizarlo), salimos
    if (!id) return; 

    const fetchPersona = async () => {
      setCargandoInicial(true);
      setErrorCarga(false);
      setMensaje('Cargando datos...');

      try {
        // 2. Hacer la petición GET al endpoint dinámico
        const res = await fetch(`/api/persona/${id}`, { method: 'GET' }); 
        
        if (res.ok) {
          const data = await res.json();

          // 3. Formatear la fecha. PostgreSQL puede devolver un timestamp,
          // necesitamos el formato 'YYYY-MM-DD' para el input type="date".
          const dateOnly = data.nacimiento ? new Date(data.nacimiento).toISOString().split('T')[0] : '';
          
          setPersona({
            nombre: data.nombre,
            apellido: data.apellido,
            nacimiento: dateOnly,
            dni: String(data.dni), // Convertir a string para el input
          });
          setMensaje('');
        } else {
          // Si el servidor devuelve 404 (No encontrado) o 500 (Error)
          const errorData = await res.json();
          setErrorCarga(true);
          setMensaje(`❌ Error al cargar datos: ${errorData.error || res.statusText}`);
          console.error('Error al cargar datos:', errorData);
        }

      } catch (error) {
        // Error de red
        setErrorCarga(true);
        setMensaje('❌ Error de conexión al intentar cargar los datos.');
        console.error('Error de conexión:', error);
      } finally {
        setCargandoInicial(false);
      }
    };

    fetchPersona();
  }, [id]); // El efecto se dispara cuando el ID cambia


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersona(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('Enviando actualización...');

    const dataToSend = {
      ...persona,
      dni: Number(persona.dni), // Convertir a número para el backend
    };

    try {
      // 4. Usar el ID real para la petición PUT
      const res = await fetch(`/api/persona/${id}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        const result = await res.json();
        console.log('Persona actualizada:', result.data);
        setMensaje('✅ Persona actualizada exitosamente.');
      } else {
        const errorData = await res.json();
        console.error('Error del servidor:', errorData);
        setMensaje(`❌ Error al actualizar: ${errorData.error || res.statusText}`);
      }

    } catch (error) {
      console.error('Error de conexión o desconocido:', error);
      setMensaje('❌ Error de conexión con el servidor. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
      if (mensaje.startsWith('✅')) {
         // Limpiamos el mensaje de éxito después de 3 segundos
         setTimeout(() => setMensaje(''), 3000);
      }
    }
  };

  // --- Renderizado Condicional ---
  if (cargandoInicial) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-xl text-indigo-600 animate-pulse">{mensaje}</p>
      </div>
    );
  }
  
  if (errorCarga) {
     return (
        <div className="min-h-screen flex items-center justify-center p-4">
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md" role="alert">
              <strong className="font-bold">Error de Carga:</strong>
              <span className="block sm:inline"> {mensaje}</span>
              <p className="text-sm mt-2">Asegúrate de que la URL contenga un ID válido (ej: `/persona/5/edit`) y que tu base de datos esté funcionando.</p>
           </div>
        </div>
     );
  }

  // Formulario si todo se cargó correctamente
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Editar Persona (ID: {id})
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input type="text" name="nombre" value={persona.nombre} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none" required disabled={cargando} />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
            <input type="text" name="apellido" value={persona.apellido} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none" required disabled={cargando} />
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
            <input type="date" name="nacimiento" value={persona.nacimiento} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none" required disabled={cargando} />
          </div>

          {/* DNI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
            <input type="number" name="dni" value={persona.dni} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none" required disabled={cargando} />
          </div>

          <button
            type="submit"
            disabled={cargando} 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:bg-green-400"
          >
            {cargando ? 'Actualizando...' : 'Actualizar Datos'}
          </button>
        </form>

        {mensaje && !cargandoInicial && (
          <div className={`mt-6 p-4 rounded-lg ${mensaje.startsWith('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-center font-medium ${mensaje.startsWith('✅') ? 'text-green-700' : 'text-red-700'}`}>{mensaje}</p>
          </div>
        )}
      </div>
    </div>
  );
}