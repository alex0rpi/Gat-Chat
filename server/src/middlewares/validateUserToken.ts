import 'dotenv/config';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { InvalidTokenError } from '../controllers/helpers/ErrorHandler';

export const validateUserToken: RequestHandler = async (req, res, next) => {
  if (!req.body.token) {
    const error = new InvalidTokenError(
      'Authentication failed due to invalid or non existing token',
      403
    );
    return res.json(error);
  }
  try {
    /*Authorization: 'Bearer TOKEN' so, the token is part of the authorization string that comes with the header.*/
    const decodedToken = jwt.verify(req.body.token, 'chatapp'); //* change to env variable
    // console.log('decoded token:', decodedToken);
    if (!decodedToken) {
      const error = new InvalidTokenError(
        'Authentication failed due to invalid or non existing token',
        403
      );
      return res.json(error);
    }
    res.status(200).json({ payload: decodedToken });
  } catch (err) {}
};