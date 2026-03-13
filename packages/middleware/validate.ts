import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ValidationError } from "../error-handler";

export const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        const message = error.details.map(d => d.message).join(", ");
        return next(new ValidationError(message));
    }
    req.body = value;
    next();
};
