"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./utils/config"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const middleware_1 = __importDefault(require("./utils/middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require('express-async-errors');
const app = (0, express_1.default)();
// ROUTER REFERENCE
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const review_route_1 = __importDefault(require("./routes/review.route"));
const paypal_route_1 = __importDefault(require("./routes/paypal.route"));
const logger_1 = __importDefault(require("./utils/logger"));
mongoose_1.default.set('strictQuery', false);
logger_1.default.info('connecting to', config_1.default.MONGODB_URI);
mongoose_1.default.connect(config_1.default.MONGODB_URI)
    .then(() => {
    logger_1.default.info('connected to MongoDB');
})
    .catch((error) => {
    logger_1.default.error('error connection to MongoDB:', error.message);
});
// MIDDLEWARES
const allowedOrigins = [config_1.default.FRONTEND_URL, 'http://localhost:3000', 'https://supreme-team-demo.netlify.app'];
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use((req, res, next) => {
    console.log('Request Cookies:', req.cookies);
    console.log('Response Headers:', res.getHeaders());
    next();
});
// app.use(cors({
//   origin: (origin, callback) => {
//     console.log("ORIGIN: ", origin);
//     console.log("ALLOWED ORIGINS: ", allowedOrigins);
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     }
//     else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // Allow cookies
// }));
app.use(express_1.default.static('dist'));
app.use(express_1.default.json());
app.use(middleware_1.default.requestLogger);
// ROUTER
app.use('/api/users', user_routes_1.default);
app.use('/api/auth', auth_route_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/orders', order_route_1.default);
app.use('/api/reviews', review_route_1.default);
app.use('/api/paypal', paypal_route_1.default);
app.use(middleware_1.default.unknownEndpoint);
app.use(middleware_1.default.errorHandler);
exports.default = app;
