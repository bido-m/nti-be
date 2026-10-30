export const authorization = (roles=[]) => {
    return(req,res,next) => {
        try {
            if(!roles.includes(req.user.role)){
                return res.json({message:"forbidden account"});
            }
            return next();
        } catch (error) {
            return res.json({error});
        }
    }
}