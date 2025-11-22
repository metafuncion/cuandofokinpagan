const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS para permitir requests desde tu frontend
app.use(cors({
  origin: [
    'https://cuandofokinpagan.cl',
    'http://cuandofokinpagan.cl',  // ← Agregado HTTP
    'https://www.cuandofokinpagan.cl',
    'http://www.cuandofokinpagan.cl',
    'https://metafuncion.github.io',
    'http://localhost'
  ],
  methods: ['GET']
}));

// Servir archivos estáticos de la carpeta memes
app.use('/memes', express.static(path.join(__dirname, 'memes')));

// Endpoint principal - listar todos los memes
app.get('/api/memes', (req, res) => {
  const memesDir = path.join(__dirname, 'memes');
  
  // Verificar si la carpeta existe
  if (!fs.existsSync(memesDir)) {
    return res.status(404).json({ 
      error: 'Memes folder not found',
      message: 'Create a "memes" folder in the backend directory'
    });
  }
  
  // Leer archivos de la carpeta memes/
  fs.readdir(memesDir, (err, files) => {
    if (err) {
      console.error('Error reading memes directory:', err);
      return res.status(500).json({ 
        error: 'Error reading memes directory',
        message: err.message 
      });
    }
    
    // Filtrar solo archivos de imagen
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    // Devolver lista con URLs completas
    const memeUrls = imageFiles.map(file => `/memes/${file}`);
    
    res.json({ 
      memes: memeUrls,
      total: memeUrls.length,
      timestamp: new Date().toISOString()
    });
  });
});

// Info del servidor (ruta raíz)
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Cuando Fokin Pagan 💸',
    version: '1.0.0',
    endpoints: {
      memes: '/api/memes',
      static: '/memes/:filename'
    }
  });
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/memes`);
});

