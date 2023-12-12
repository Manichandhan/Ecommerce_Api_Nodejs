class CustomError extends Error{
    constructor(statusCode,message,errCode){
        super(message)
        this.statusCode=statusCode
        this.errCode=errCode
    }
}
module.exports={CustomError}