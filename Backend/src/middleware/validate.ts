import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance, { whitelist: true });

    if (errors.length > 0) {
      const messages = errors.map(err => Object.values(err.constraints || {})).flat();
      return res.status(400).json({ errors: messages });
    }

    next();
  };
};
