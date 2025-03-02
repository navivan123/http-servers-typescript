import express from 'express';
import { handlerReadiness } from "./api/readiness.js";
import path from 'path';
import { middlewareLogResponses, middlewareMetricsInc, errorHandler } from './api/middleware.js';
import { config } from './config.js';
import { handlerMetrics, handlerReset } from './api/numrequests.js';
import { handlerValidateChirps, handlerBrew } from './api/chirps.js';

const app = express();
//const PORT = 8080;
const PORT = 25568;

// Middleware
app.use(express.json());
app.use(middlewareLogResponses);
app.use('/app', middlewareMetricsInc, express.static('./src/app'));

// api handlers
app.get('/api/healthz', (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.post('/api/validate_chirp', (req, res, next) => {
    Promise.resolve(handlerValidateChirps(req, res)).catch(next);
});
app.get('/api/brew', (req, res, next) => {
    Promise.resolve(handlerBrew(req, res)).catch(next);
});


// admin handlers
app.get('/admin/metrics', handlerMetrics);
app.post('/admin/reset', handlerReset);

// Middleware for errors
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
