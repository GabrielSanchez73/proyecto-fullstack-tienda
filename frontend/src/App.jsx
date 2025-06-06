import { useState } from 'react';
// Asegúrate de que Tailwind CSS esté configurado en tu proyecto.
// Si no lo está, puedes añadirlo siguiendo la guía de instalación de Tailwind.
// import './style.css'; // Puedes mantener tu CSS si es necesario para otros estilos.

// Importar componentes de Material UI
import { Container, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert, CircularProgress } from '@mui/material';

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
        setMensaje({ texto: 'Producto guardado correctamente.', tipo: 'success' }); // Cambiado a 'success' para Material UI Alert
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

  // Clases de Tailwind para los mensajes - Ya no necesarias con Material UI Alert
  // const getMensajeClasses = () => {
  //   if (!mensaje.texto) return 'hidden';
  //   let baseClasses = 'p-4 mb-4 text-sm rounded-lg';
  //   if (mensaje.tipo === 'exito') {
  //     return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-200 dark:text-green-800`;
  //   } else if (mensaje.tipo === 'error') {
  //     return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-800`;
  //   } else if (mensaje.tipo === 'info') {
  //     return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-200 dark:text-blue-800`;
  //   }
  //   return 'hidden';
  // };

  return (
    // Reemplazado el div principal con Container y Box de Material UI
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        {/* Título */}
        <Typography component="h1" variant="h4" gutterBottom>
          Registrar Nuevo Producto
        </Typography>

        {/* Área de Mensajes */}
        {mensaje.texto && (
          <Alert severity={mensaje.tipo} sx={{ width: '100%', mb: 2 }}>
            {mensaje.texto}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          {/* Campo Nombre */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="nombre"
            label="Nombre del Producto"
            name="nombre"
            autoComplete="name"
            value={producto.nombre}
            onChange={handleChange}
            autoFocus
          />

          {/* Campo Precio */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="precio"
            label="Precio (COP)"
            name="precio"
            type="number"
            value={producto.precio}
            onChange={handleChange}
            inputProps={{ min: "0", step: "0.01" }}
          />

          {/* Campo Talla */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="talla-label">Talla</InputLabel>
            <Select
              labelId="talla-label"
              id="talla"
              name="talla"
              value={producto.talla}
              label="Talla"
              onChange={handleChange}
            >
              <MenuItem value="">Selecciona una talla</MenuItem>
              <MenuItem value="XS">XS</MenuItem>
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="L">L</MenuItem>
              <MenuItem value="XL">XL</MenuItem>
              <MenuItem value="XXL">XXL</MenuItem>
            </Select>
          </FormControl>

          {/* Campo Color */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="color"
            label="Color"
            name="color"
            value={producto.color}
            onChange={handleChange}
            placeholder="Ej: Azul Marino"
          />

          {/* Botón de Envío */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={mensaje.tipo === 'info'}
          >
            {mensaje.tipo === 'info' ? <CircularProgress size={24} color="inherit" /> : 'Guardar Producto'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          Gestiona tus productos de forma eficiente.
        </Typography>
      </Box>
    </Container>
  );
}

export default App;
