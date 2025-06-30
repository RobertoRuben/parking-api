import { Router } from 'express';
import { VehicleController } from "@/vehicle/controller/vehicle.controller";

const router = Router();
const vehicleController = new VehicleController();

router.post('/', vehicleController.create);
router.get('/', vehicleController.getPage);
router.get('/license/:licensePlate', vehicleController.findByLicensePlate);
router.get('/:id', vehicleController.findById);
router.put('/:id', vehicleController.update);
router.delete('/:id', vehicleController.delete);

export default router;