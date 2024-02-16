const asyncHandler = (requestHandler) => async (req, res, next) => {

    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((error) => next(error))
    }

}

export { asyncHandler };