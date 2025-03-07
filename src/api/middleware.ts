import { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';
import { error } from 'console';
import { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError, HTTPError } from './error.js';
import { respondWithJSON, respondWithError } from './json.js';

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
        if (res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}\n`)
        }
    });
    next();
};

export function middlewareMetricsInc(req: Request, _: Response, next: NextFunction) {
    if (!req.path.startsWith('/admin')) {
        config.api.fileserverHits++;
    }
    next();
}

export function errorHandler(err: Error, _: Request, res: Response, __: NextFunction,) {
    console.error("Error ->", err.stack || err);
    if (err instanceof HTTPError) {
        respondWithError(res, err.code, err.message);
        //res.status(err.code).send(err.message);
    } else {
        //res.end()
        res.status(500).send(`Internal Server Error: ${err.message}`)
    }
}

