import dotenv from 'dotenv';
dotenv.config();

import { createServer } from './server';
import { createAPI } from './api';

const app = createAPI();

createServer(app);
