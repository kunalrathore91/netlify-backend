import express from 'express';
import * as handler from '../handler/residencyHandler';
import jwtCheck from '../../config/auth0Config';

const router = express.Router();

router.post('/create', jwtCheck, handler.createResidency);
router.get('/allresd', handler.getAllResidencies);
router.get('/:id', handler.getResidencyById);

export default router;
