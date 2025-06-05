import { useState } from 'react';
// Asegúrate de que Tailwind CSS esté configurado en tu proyecto.
// Si no lo está, puedes añadirlo siguiendo la guía de instalación de Tailwind.
// import './style.css'; // Puedes mantener tu CSS si es necesario para otros estilos.

function App() {
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    talla: '',
    color: ''
  });

  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' }); // Para mostrar mensajes de éxito/error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prevProducto => ({
      ...prevProducto,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' }); // Limpiar mensaje anterior

    // Validación simple
    if (!producto.nombre || !producto.precio || !producto.talla || !producto.color) {
      setMensaje({ texto: 'Todos los campos son obligatorios.', tipo: 'error' });
      return;
    }
    if (isNaN(parseFloat(producto.precio)) || parseFloat(producto.precio) <= 0) {
      setMensaje({ texto: 'El precio debe ser un número positivo.', tipo: 'error' });
      return;
    }

    try {
      // Mostramos un mensaje de carga
      setMensaje({ texto: 'Guardando producto...', tipo: 'info' });

      const res = await fetch('http://localhost:8080/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
      });

      if (res.ok) {
        setMensaje({ texto: 'Producto guardado correctamente.', tipo: 'exito' });
        setProducto({ nombre: '', precio: '', talla: '', color: '' }); // Limpiar formulario
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Error desconocido al guardar el producto.' }));
        setMensaje({ texto: `Error al guardar el producto: ${errorData.message || res.statusText}`, tipo: 'error' });
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setMensaje({ texto: 'Error de conexión con el servidor. Inténtalo más tarde.', tipo: 'error' });
    }
  };

  // Clases de Tailwind para los mensajes
  const getMensajeClasses = () => {
    if (!mensaje.texto) return 'hidden';
    let baseClasses = 'p-4 mb-4 text-sm rounded-lg';
    if (mensaje.tipo === 'exito') {
      return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-200 dark:text-green-800`;
    } else if (mensaje.tipo === 'error') {
      return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-800`;
    } else if (mensaje.tipo === 'info') {
      return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-200 dark:text-blue-800`;
    }
    return 'hidden';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 shadow-2xl rounded-xl p-8 space-y-6 transform transition-all duration-500 hover:scale-105">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 mb-8">
          Registrar Nuevo Producto
        </h1>

        {/* Área de Mensajes */}
        {mensaje.texto && (
          <div
            id="mensaje-usuario"
            className={getMensajeClasses()}
            role="alert"
          >
            <span className="font-medium">{mensaje.tipo === 'exito' ? '¡Éxito!' : mensaje.tipo === 'error' ? 'Error:' : 'Info:'}</span> {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre del Producto
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={producto.nombre}
              onChange={handleChange}
              placeholder="Ej: Camiseta ProFit"
              className="mt-1 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition duration-300"
            />
          </div>

          {/* Campo Precio */}
          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Precio (COP)
            </label>
            <input
              type="number"
              name="precio"
              id="precio"
              value={producto.precio}
              onChange={handleChange}
              placeholder="Ej: 75000"
              min="0"
              step="0.01"
              className="mt-1 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition duration-300"
            />
          </div>

          {/* Campo Talla */}
          <div>
            <label htmlFor="talla" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Talla
            </label>
            <select
              name="talla"
              id="talla"
              value={producto.talla}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-900 dark:text-slate-100 transition duration-300"
            >
              <option value="">Selecciona una talla</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          {/* Campo Color */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Color
            </label>
            <input
              type="text"
              name="color"
              id="color"
              value={producto.color}
              onChange={handleChange}
              placeholder="Ej: Azul Marino"
              className="mt-1 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition duration-300"
            />
            {/* Alternativa con input type color y selector básico */}
            {/* <div className="flex items-center space-x-2 mt-2">
              <input
                type="color"
                name="colorPicker" // Nombre diferente para no interferir directamente con el estado 'color' si quieres manejarlo separado
                id="colorPicker"
                onChange={(e) => setProducto(prev => ({...prev, color: e.target.value}))} // Actualiza el color directamente
                className="h-10 w-10 rounded-md border border-slate-300 dark:border-slate-600 cursor-pointer"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">O elige un color</span>
            </div>
            */}
          </div>

          {/* Botón de Envío */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-slate-800 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              disabled={mensaje.tipo === 'info'} // Deshabilitar mientras se guarda
            >
              {mensaje.tipo === 'info' ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Guardar Producto'}
            </button>
          </div>
        </form>
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-8">
          Gestiona tus productos de forma eficiente.
        </p>
      </div>
    </div>
  );
}

export default App;
