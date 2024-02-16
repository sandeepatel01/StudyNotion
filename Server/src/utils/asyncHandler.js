const asyncHandler = (requestHandler) => async (req, res, next) => {

    // Use Promise 
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((error) => next(error))
    }




    // try {
    //     await fn(req, res, next)
    // } catch (error) {
    //     res.status(error.code || 500).json(
    //         {
    //             success: false,
    //             message: error.message
    //         }
    //     )
    // }


}

export { asyncHandler };