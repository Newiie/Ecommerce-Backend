"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("./AppError"));
const logger_1 = __importDefault(require("./logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// REPOSITORIES REFERENCE
const mongodb_user_repository_1 = __importDefault(require("../repositories/User/mongodb.user.repository"));
const UserRepository = new mongodb_user_repository_1.default();
// MODELS REFERENCE
const user_model_1 = __importDefault(require("../models/user.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const review_model_1 = __importDefault(require("../models/review.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
// ENVIRONMENT VARIABLES
const client_id = process.env.PAYPAL_CLIENT_ID;
const client_secret = process.env.PAYPAL_CLIENT_SECRET;
const endpoint_url = process.env.ENDPOINT_URL;
// MIDDLEWARE FUNCTIONS
const jwtAuth = (allowedRoles) => async (req, res, next) => {
    console.log("Authorization Header: ", req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];
    console.log("TOKEN: ", token);
    if (!token || token === "null" || token === undefined || token === '') {
        console.log("NO TOKEN");
        return res.status(401).json({ message: 'No token provided' });
    }
    console.log("IT WENT THROUGH?");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
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
    }
    catch (error) {
        next(error);
    }
};
const get_access_token = async () => {
    const auth = `${client_id}:${client_secret}`;
    console.log("AUTH: ", auth);
    const data = 'grant_type=client_credentials';
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
    });
};
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError_1.default) {
        return res.status(err.status).json({
            message: err.message,
            error: {
                status: err.status,
                isOperational: err.isOperational,
            }
        });
    }
    console.log("ERROR HANDLER: ", err);
    if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
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
const requestLogger = (request, response, next) => {
    logger_1.default.info('Method:', request.method);
    logger_1.default.info('Path:  ', request.path);
    logger_1.default.info('Body:  ', request.body);
    logger_1.default.info('Params:  ', request.params);
    logger_1.default.info('Query:  ', request.query);
    logger_1.default.info('---');
    next();
};
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
const resetAllData = async () => {
    try {
        await user_model_1.default.deleteMany({});
        await product_model_1.default.deleteMany({});
        await order_model_1.default.deleteMany({});
        await review_model_1.default.deleteMany({});
        logger_1.default.info('All data has been reset.');
    }
    catch (error) {
        logger_1.default.error('Error resetting data:', error.message);
    }
};
exports.default = {
    errorHandler,
    requestLogger,
    unknownEndpoint,
    resetAllData,
    get_access_token,
    jwtAuth
};
