import { HttpException } from './http-exception';

export class ConflictException extends HttpException {
    constructor(message: string = 'Conflict') {
        super(409, message);
        
        Object.setPrototypeOf(this, ConflictException.prototype);
    }
}
