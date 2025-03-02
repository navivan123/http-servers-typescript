// Base HTTPError class that adds HTTP code to the Error class.
export class HTTPError extends Error {
    readonly code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}

// http 400 error
export class BadRequestError extends HTTPError {
    constructor(message: string = "Bad Request") {
        super(message, 400);
    }
}

// http 401 error
export class UnauthorizedError extends HTTPError {
    constructor(message: string = "Unauthorized") {
        super(message, 401);
    }
}

// http 403 error
export class ForbiddenError extends HTTPError {
    constructor(message: string = "Forbidden") {
        super(message, 403);
    }
}

// http 404 error
export class NotFoundError extends HTTPError {
    constructor(message: string = "Not Found") {
        super(message, 404);
    }
}

// http 405 error 
export class MethodNotAllowedError extends HTTPError {
    constructor(message: string = "Method Not Allowed") {
        super(message, 405);
    }
}

// http 408 error
export class RequestTimeoutError extends HTTPError {
    constructor(message: string = "Request Timeout") {
        super(message, 408);
    }
}

// http 418 error
export class ImATeapotError extends HTTPError {
    constructor(message: string = "I'm a teapot") {
        super(message, 418);
    }
}
