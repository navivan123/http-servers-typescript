import { Request, Response } from 'express';
import { respondWithJSON, respondWithError } from "./json.js";
import { BadRequestError, ForbiddenError, ImATeapotError, NotFoundError, UnauthorizedError } from "./error.js";
import { UUID } from 'crypto';
import { createChirp, deleteChirp, getAllChirps, getChirp, getChirpsByUserId } from '../db/queries/chirps.js';
import { NewChirp } from '../db/schema.js';
import { getBearerToken, validateJWT } from './auth.js';
import { config } from '../config.js';

export async function handlerChirps(req: Request, res: Response) {
    type parameters = { body: string; };
    const params: parameters = req.body;

    const token = getBearerToken(req);
    let userId;
    try {
        userId = validateJWT(token, config.secret);
    } catch (err) {
        throw new UnauthorizedError(`Error while authorizing JWT: ${err}`)
    }

    if ((params.body ?? "").length === 0) {
        throw new BadRequestError("Chirp is empty!\n")
    }

    if (params.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140")
    }

    const chirp: NewChirp = { body: filter(params.body), userId: userId };
    const newChirp = await createChirp(chirp);
    respondWithJSON(res, 201, newChirp);


    /*    const response: ChirpResponse = {
            id: newChirp.id,
            createdAt: newChirp.createdAt.toISOString(),
            updatedAt: newChirp.updatedAt.toISOString(),
            body: newChirp.body,
            userId: newChirp.user_id,
        }
    respondWithJSON(res, 201, response);
    */

}

export async function handlerGetAllChirps(req: Request, res: Response) {

    let authorId = '';
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === 'string') {
        authorId = authorIdQuery;
    }

    let sort = '';
    let sortQuery = req.query.sort;
    if (typeof sortQuery === 'string') {
        sort = sortQuery;
    }

    let allChirps;
    if (authorId === "") {
        allChirps = await getAllChirps();
    } else {
        allChirps = await getChirpsByUserId(authorId as UUID);
    }

    if (!allChirps) {
        throw new NotFoundError();
    }

    if (sort === "desc") {
        allChirps.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            if (a.createdAt > b.createdAt) return -1;
            return 0;
        });
    } else {
        allChirps.sort((a, b) => {
            if (a.createdAt < b.createdAt) return -1;
            if (a.createdAt > b.createdAt) return 1;
            return 0;
        });
    }

    respondWithJSON(res, 200, allChirps);

}

export async function handlerGetChirp(req: Request, res: Response) {
    const chirp = await getChirp(req.params.chirpID as UUID);
    if (!chirp) {
        throw new NotFoundError();
    }
    respondWithJSON(res, 200, chirp);
}

export async function handlerDeleteChirp(req: Request, res: Response) {
    const token = getBearerToken(req);
    let userId;
    try {
        userId = validateJWT(token, config.secret);
    } catch (err) {
        throw new UnauthorizedError(`Error while authorizing JWT: ${err}`)
    }

    const chirp = await getChirp(req.params.chirpID as UUID);
    if (!chirp) {
        throw new NotFoundError();
    }

    if (userId !== chirp.userId) {
        throw new ForbiddenError();
    }

    const chirpDeleted = await deleteChirp(req.params.chirpID as UUID);
    if (!chirpDeleted) {
        throw new Error("Could not delete chirp");
    }

    res.sendStatus(204);
}
function filter(body: string): string {
    const post = body.split(" ")
    for (let i = 0; i < post.length; i++) {
        const word = post[i].toLowerCase()
        if (word === "kerfuffle" || word === "sharbert" || word === "fornax") {
            post[i] = "****"
        }
    }
    return post.join(" ")
}

export async function handlerBrew(_: Request, __: Response) {
    throw new ImATeapotError();
}

