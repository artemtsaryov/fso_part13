const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeDatabaseError" ||
    error.name === "ValidationError"
  ) {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

module.exports = errorHandler;
