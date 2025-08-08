import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // For GET requests, validate query parameters; for others, validate body
    let dataToValidate = req.method === 'GET' ? req.query : req.body;
    
    // Handle nested data structure (when data is wrapped in a 'data' property)
    if (dataToValidate && dataToValidate.data && typeof dataToValidate.data === 'object') {
      dataToValidate = dataToValidate.data;
    }
    
    const dtoInstance = plainToInstance(dtoClass, dataToValidate);
    const errors = await validate(dtoInstance, { whitelist: true });

    if (errors.length > 0) {
      const messages = errors.map(err => Object.values(err.constraints || {})).flat();
      return res.status(400).json({ errors: messages });
    }

    // Update the request body with the validated data for the controller to use
    if (req.method !== 'GET') {
      req.body = dataToValidate;
    }

    next();
  };
};
