import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import routes from './routes/index.js';  // Only keep one import for 'routes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files of the client's dist folder
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to connect the routes
app.use(routes);

// Start the server
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
