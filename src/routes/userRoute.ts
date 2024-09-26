import express from 'express';
import * as handler from '../handler/userHandler';
import jwtCheck from '../../config/auth0Config';

const router = express.Router();

router.post('/register', jwtCheck, handler.createUser);
router.post('/bookVisit/:id', jwtCheck, handler.bookVisit);
router.post('/allBookings', handler.allBookings);
router.post('/removeBooking/:id', handler.cancelBooking);
router.post('/toFav/:rid', jwtCheck, handler.toFavorite);
router.post('/allFav', jwtCheck, handler.getAllFavorites);

export default router;
