import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import vehicleRoutes from "@/vehicle/routes/vehicle.routes";
import { errorHandler } from '@/middleware/error-handler.middleware';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/vehicles', vehicleRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

export default app;