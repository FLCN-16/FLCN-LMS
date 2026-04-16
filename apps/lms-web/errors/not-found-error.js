class NotFoundError extends Error {
    status = 404;
    name = "NotFoundError";
    constructor(message = "Resource not found") {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
export default NotFoundError;
