class NotFoundError extends Error {
  public readonly status: number = 404
  public readonly name: string = "NotFoundError"

  constructor(message: string = "Resource not found") {
    super(message)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export default NotFoundError
