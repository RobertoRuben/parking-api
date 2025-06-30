export class HttpException extends Error {
    readonly statusCode: number;
    readonly message: string;
    readonly errors?: any[];

    constructor(statusCode: number, message: string, errors?: any[]) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        
        Object.setPrototypeOf(this, HttpException.prototype);
    }
}
