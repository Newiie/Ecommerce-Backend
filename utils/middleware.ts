import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';
import logger from './logger';
import jwt from 'jsonwebtoken';

// REPOSITORIES REFERENCE

import MongoDbUserRepository from '../repositories/User/mongodb.user.repository';
const UserRepository = new MongoDbUserRepository();

// MODELS REFERENCE
import User from '../models/user.model';
import Order from "../models/order.model";
import Review from "../models/review.model";
import Product from "../models/product.model";
import { IJwtToken } from './types';

// ENVIRONMENT VARIABLES
const client_id = process.env.PAYPAL_CLIENT_ID;
const client_secret = process.env.PAYPAL_CLIENT_SECRET;
const endpoint_url = process.env.ENDPOINT_URL;

// Extend the Request interface to include userId
declare module 'express-serve-static-core' {
    interface Request {
        id?: string;
        role?: string;
    }
}

// MIDDLEWARE FUNCTIONS
const jwtAuth = (allowedRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    console.log("Authorization Header: ", req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];
    console.log("TOKEN: ", token);
    if (!token || token === "null" || token === undefined || token === '') {
        console.log("NO TOKEN");
        return res.status(401).json({ message: 'No token provided' });
    }

    console.log("IT WENT THROUGH?");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IJwtToken;
        
        console.log("DECODED: ", decoded);
        console.log("ALLOWED ROLES: ", allowedRoles);
        if (!allowedRoles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
        }

        const user = await UserRepository.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.id = decoded.id;
        req.role = decoded.role;
        next();
    } catch (error) {
        next(error);
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

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.status).json({
            message: err.message,
            error: {
                status: err.status,
                isOperational: err.isOperational,
            }
        });
    }

    console.log("ERROR HANDLER: ", err);

    if (err instanceof jwt.TokenExpiredError) {
        console.log("TOKEN EXPIRED");
        return res.status(401).json({
            message: 'Token expired',
            error: {
                status: 401,
                isOperational: false,
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
    get_access_token,
    jwtAuth
};
