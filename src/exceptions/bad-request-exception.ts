import { HttpException } from './http-exception';

export class BadRequestException extends HttpException {
    constructor(message: string = 'Bad Request', errors?: any[]) {
        super(400, message, errors);
        
        Object.setPrototypeOf(this, BadRequestException.prototype);
    }
}
