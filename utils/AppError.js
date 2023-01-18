class AppError extends Error{
    constructor(statusCode,message){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.status = `${this.statusCode}`.startsWith("4") ? "faild" : "error"
        this.isOperational = true
        Error.captureStackTrace(this,AppError)
    }
}
module.exports = AppError