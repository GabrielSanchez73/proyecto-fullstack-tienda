import { useState, useEffect } from 'react';
// Asegúrate de que Tailwind CSS esté configurado en tu proyecto.
// Si no lo está, puedes añadirlo siguiendo la guía de instalación de Tailwind.
// import './style.css'; // Puedes mantener tu CSS si es necesario para otros estilos.

// Importar componentes de Material UI
import { Container, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function App() {
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    talla: '',
    color: ''
  });

  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' }); // Para mostrar mensajes de éxito/error
  const [productos, setProductos] = useState([]); // Estado para almacenar la lista de productos
  const [loading, setLoading] = useState(false); // Estado para mostrar indicador de carga
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  // Función para obtener la lista de productos del backend
  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/productos');
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else {
        setMensaje({ texto: 'Error al cargar los productos.', tipo: 'error' });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setMensaje({ texto: 'Error de conexión con el backend.', tipo: 'error' });
    }
  };

  // Efecto para cargar los productos cuando el componente se monta
  useEffect(() => {
    fetchProductos();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prevProducto => ({
      ...prevProducto,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const url = editando 
        ? `http://localhost:8080/api/productos/${idEditando}`
        : 'http://localhost:8080/api/productos';
      
      const method = editando ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });

      if (response.ok) {
        setMensaje({ 
          texto: editando ? 'Producto actualizado con éxito!' : 'Producto agregado con éxito!', 
          tipo: 'success' 
        });
        setProducto({ nombre: '', precio: '', talla: '', color: '' });
        setEditando(false);
        setIdEditando(null);
        fetchProductos();
      } else {
        const errorData = await response.json();
        setMensaje({ 
          texto: `Error al ${editando ? 'actualizar' : 'agregar'} el producto: ${errorData.message || response.statusText}`, 
          tipo: 'error' 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ 
        texto: `Error de conexión al ${editando ? 'actualizar' : 'agregar'} producto.`, 
        tipo: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la eliminación de un producto
  const handleDelete = async (id) => {
    setLoading(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMensaje({ texto: 'Producto eliminado con éxito!', tipo: 'success' });
        fetchProductos(); // Actualizar la lista de productos
      } else {
        const errorData = await response.json();
        setMensaje({ texto: `Error al eliminar el producto: ${errorData.message || response.statusText}`, tipo: 'error' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setMensaje({ texto: 'Error de conexión al eliminar producto.', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (producto) => {
    setProducto({
      nombre: producto.nombre,
      precio: producto.precio,
      talla: producto.talla,
      color: producto.color
    });
    setEditando(true);
    setIdEditando(producto.id);
  };

  const handleCancelEdit = () => {
    setProducto({ nombre: '', precio: '', talla: '', color: '' });
    setEditando(false);
    setIdEditando(null);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {editando ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </Typography>
        {mensaje.texto && (
          <Alert severity={mensaje.tipo} sx={{ mt: 2, width: '100%' }}>
            {mensaje.texto}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nombre"
            label="Nombre del Producto"
            name="nombre"
            autoComplete="nombre"
            autoFocus
            value={producto.nombre}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="precio"
            label="Precio"
            type="number"
            id="precio"
            autoComplete="precio"
            value={producto.precio}
            onChange={handleChange}
          />
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
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="L">L</MenuItem>
              <MenuItem value="XL">XL</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="color"
            label="Color"
            name="color"
            autoComplete="color"
            value={producto.color}
            onChange={handleChange}
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (editando ? 'Actualizar Producto' : 'Agregar Producto')}
            </Button>
            {editando && (
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
          </Box>
        </Box>

        <Typography component="h2" variant="h6" sx={{ mt: 4, mb: 2 }}>
          Lista de Productos
        </Typography>
        <TableContainer component={Paper} sx={{ width: '100%' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Talla</TableCell>
                <TableCell align="right">Color</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((prod) => (
                <TableRow
                  key={prod.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {prod.nombre}
                  </TableCell>
                  <TableCell align="right">{prod.precio}</TableCell>
                  <TableCell align="right">{prod.talla}</TableCell>
                  <TableCell align="right">{prod.color}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(prod)}
                        disabled={loading}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(prod.id)}
                        disabled={loading}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Box>
    </Container>
  );
}

export default App;
