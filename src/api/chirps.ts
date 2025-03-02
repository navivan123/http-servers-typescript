import { Request, Response } from 'express';
import { respondWithJSON, respondWithError } from "./json.js";
import { BadRequestError, ImATeapotError } from "./error.js";

export async function handlerValidateChirps(req: Request, res: Response) {
    type parameters = { body: string; };
    const params: parameters = req.body;

    if ((params.body ?? "").length === 0) {
        throw new BadRequestError("Chirp is empty!\n")
    }

    if (params.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140")
    }

    respondWithJSON(res, 200, { cleanedBody: filter(params.body), });
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

export async function handlerBrew(req: Request, res: Response) {
    throw new ImATeapotError("We don't brew coffee in no teapots around here!");
}

