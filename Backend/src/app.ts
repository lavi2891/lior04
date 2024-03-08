import express from 'express';
import cors from 'cors';
const session = require('express-session');
import { Session } from 'express-session';
import vacationRoutes from './routes/vacationRoutes';
import userRoutes from './routes/userRoutes';
import imageRoutes from './routes/imageRoutes';
import followersRoutes from './routes/followersRoutes';
import path from 'path';

const port = process.env.PORT || 3001;
const app = express();

app.use(cors())

// Use the session middleware
app.use(
  session({
    secret: 'afgfhakloyoilk',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      path: '/api'
    },
  })
);
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/followers', followersRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
