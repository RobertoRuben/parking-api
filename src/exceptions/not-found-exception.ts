import { HttpException } from './http-exception';

export class NotFoundException extends HttpException {
    constructor(message: string = 'Resource Not Found') {
        super(404, message);
        
        Object.setPrototypeOf(this, NotFoundException.prototype);
    }
}
