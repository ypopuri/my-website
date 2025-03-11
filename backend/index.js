// backend/index.js (ES Modules)

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors()); // Enable CORS for all routes
app.use(morgan('dev')); // Log requests to the console

// Serve static files from the frontend's public folder
app.use('/models', express.static(path.join(__dirname, '../frontend/public/models')));

// Example route
app.get('/', (req, res) => {
    res.send('Backend is working!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});