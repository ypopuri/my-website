import 'bootstrap/dist/css/bootstrap.min.css';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Backend is working!');
});

// Example API to serve static models
app.use('/models', express.static('public/models'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
