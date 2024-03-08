"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const session = require('express-session');
const vacationRoutes_1 = __importDefault(require("./routes/vacationRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
const followersRoutes_1 = __importDefault(require("./routes/followersRoutes"));
const port = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Use the session middleware
app.use(session({
    secret: 'afgfhakloyoilk',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        path: '/api'
    },
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/user', userRoutes_1.default);
app.use('/api/vacations', vacationRoutes_1.default);
app.use('/api/images', imageRoutes_1.default);
app.use('/api/followers', followersRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
