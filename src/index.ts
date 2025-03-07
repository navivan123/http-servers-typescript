// Database imports
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

// Standard library imports
import express from 'express';
//import path from 'path';

// Local imports
import { config } from './config.js';
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc, errorHandler } from './api/middleware.js';
import { handlerMetrics, handlerReset } from './api/numrequests.js';
import { handlerBrew, handlerChirps, handlerGetAllChirps, handlerGetChirp, handlerDeleteChirp } from './api/chirps.js';
import { handlerUsers, handlerLogin, handlerRefresh, handlerRevoke, handlerUpdateUser } from './api/users.js';
import { handlerPolkaWebhooks } from "./api/webhooks.js";

// Configure migration client
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

// start express
const app = express();

// Middleware
app.use(middlewareLogResponses);
app.use(express.json());
app.use('/app', middlewareMetricsInc, express.static('./src/app'));

// api handlers

// health handler
app.get('/api/healthz', (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
// coffee denier
app.get('/api/brew', (req, res, next) => {
    Promise.resolve(handlerBrew(req, res)).catch(next);
});

// chirps
app.get('/api/chirps', (req, res, next) => {
    Promise.resolve(handlerGetAllChirps(req, res)).catch(next);
});
app.get('/api/chirps/:chirpID', (req, res, next) => {
    Promise.resolve(handlerGetChirp(req, res)).catch(next);
});
app.post('/api/chirps', (req, res, next) => {
    Promise.resolve(handlerChirps(req, res)).catch(next);
});
app.delete('/api/chirps/:chirpID', (req, res, next) => {
    Promise.resolve(handlerDeleteChirp(req, res)).catch(next);
});

// users
app.post('/api/users', (req, res, next) => {
    Promise.resolve(handlerUsers(req, res)).catch(next);
});
app.post('/api/login', (req, res, next) => {
    Promise.resolve(handlerLogin(req, res)).catch(next);
});

// webhooks
//
// polka
app.post('/api/polka/webhooks', (req, res, next) => {
    Promise.resolve(handlerPolkaWebhooks(req, res)).catch(next);
});


// authentication methods
app.post('/api/refresh', (req, res, next) => {
    Promise.resolve(handlerRefresh(req, res)).catch(next);
});
app.post('/api/revoke', (req, res, next) => {
    Promise.resolve(handlerRevoke(req, res)).catch(next);
});

// authorization methods
app.put('/api/users', (req, res, next) => {
    Promise.resolve(handlerUpdateUser(req, res)).catch(next);
});

// admin handlers
app.get('/admin/metrics', (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post('/admin/reset', (req, res, next) => {
    Promise.resolve(handlerReset(req, res)).catch(next);
});


// Middleware for errors
app.use(errorHandler);

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});
