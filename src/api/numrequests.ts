import { Request, Response } from 'express';
import { config } from '../config.js';
import { deleteAllUsers } from "../db/queries/users.js";
import { ForbiddenError } from './error.js';
import { deleteAllChirps } from '../db/queries/chirps.js';

export async function handlerMetrics(_: Request, res: Response) {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(
        `<html>
          <body>
            <h1>Welcome, Chirpy Admin</h1>
            <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
          </body>
         </html>`
    );
}

export async function handlerReset(_: Request, res: Response) {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError();
    }

    await deleteAllUsers();
    config.api.fileserverHits = 0;
    res.sendStatus(200);
}
