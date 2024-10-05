import ErrorHandler from "../utils/ErrorHandler.js";

const catchAsyncError = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export default catchAsyncError;
