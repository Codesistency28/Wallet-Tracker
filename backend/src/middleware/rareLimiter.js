import ratelimit from "../config/upstash.js"


const rateLimiter = async(req,res,next)=>{
    try {
        const { success } = await ratelimit.limit("my-limiter")

        if (!success) {
            return res.status(429).json({
                message: "Too many requests, please try again later"
            })
        }

        next()
    } catch (error) {
        console.log("Rare limit error", error)
        next(error)
    }
}

export default rateLimiter