const validate = (schema, source = "body") => {
  return async (req, res, next) => {
    try {
      const data = await schema.parseAsync(req[source]);

      switch (source) {
        case "body":
          req.validatedData = data;
          break;

        case "params":
          req.validatedParams = data;
          break;

        case "query":
          req.validatedQuery = data;
          break;

        default:
          throw new Error(
            `Unsupported validation source: ${source}`
          );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validate;