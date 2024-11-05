import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';
import logger from './logger';
import jwt from 'jsonwebtoken';

// MODELS REFERENCE
import User from '../models/user.model';
import Order from "../models/order.model";
import Review from "../models/review.model";
import Product from "../models/product.model";
import { IJwtToken } from './types';

const client_id = process.env.PAYPAL_CLIENT_ID;
const client_secret = process.env.PAYPAL_CLIENT_SECRET;
const endpoint_url = 'https://api.sandbox.paypal.com' ;

const jwtAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IJwtToken;
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

const get_access_token = async () => {
    const auth = `${client_id}:${client_secret}`
    console.log("AUTH: ", auth);
    const data = 'grant_type=client_credentials'
    return fetch(endpoint_url + '/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`
            },
            body: data
        })
        .then(res => res.json())
        .then(json => {
            console.log("JSON: ", json);
            return json.access_token;
        })
}

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.status).json({
            message: err.message,
            error: {
                status: err.status,
                isOperational: err.isOperational,
            }
        });
    }

    return res.status(500).json({
        message: 'Server error',
        error: {
            status: 500,
            isOperational: false,
        }
    });
};

const requestLogger = (request: Request, response : Response, next: NextFunction) => {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body);
    logger.info('Params:  ', request.params);
    logger.info('Query:  ', request.query);
    logger.info('---');
    next(); 
};

const unknownEndpoint = (request: Request, response: Response) => {
response.status(404).send({ error: 'unknown endpoint' });
};

const resetAllData = async () => {
    try {
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Review.deleteMany({});
        logger.info('All data has been reset.');
    } catch (error: any) {
        logger.error('Error resetting data:', error.message);
    }
}
  

export default { 
    errorHandler,
    requestLogger,
    unknownEndpoint,
    resetAllData,
    get_access_token
};
