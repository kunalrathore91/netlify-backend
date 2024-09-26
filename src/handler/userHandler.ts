import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../config/prismaConfig';

type BookedVisit = {
    id: string;
    date: string;
    // Add other properties if necessary
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { email } = req.body;

        const existsUser = await prisma.user.findUnique({ where: { email: email } });
        if (!existsUser) {
            const user = await prisma.user.create({
                data: req.body,
            });

            res.status(201).json({
                message: 'user register successfully',
                user,
            });
        } else {
            res.status(201).json({
                message: 'user already registered',
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

//to book visiter
export const bookVisit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, date } = req.body;
        const { id } = req.params;
        console.error(req.body);

        // Check if the user exists and get their booked visits
        const user = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true },
        });

        // If no user is found, return an appropriate response
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const bookedVisits = user.bookedVisits as BookedVisit[];

        // Check if the visit is already booked
        if (bookedVisits.some((visit) => visit.id === id)) {
            return res.status(400).json({ message: 'This visit is already booked.' });
        }

        // Update the user's booked visits
        await prisma.user.update({
            where: { email },
            data: {
                bookedVisits: { push: { id, date } },
            },
        });

        res.status(201).json({
            message: 'Your visit is booked successfully',
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const allBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        const bookings = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true },
        });
        res.status(201).json({
            message: 'success',
            bookings,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true },
        });

        // Type assertion to cast bookedVisits to BookedVisit[]
        const bookedVisits = user?.bookedVisits as BookedVisit[];

        if (!bookedVisits) {
            return res.status(400).json({
                message: 'User not found or no booked visits available',
            });
        }

        const index = bookedVisits.findIndex((visit) => visit.id === id);
        if (index === -1) {
            return res.status(400).json({
                message: 'Booking not found',
            });
        } else {
            bookedVisits.splice(index, 1);
            await prisma.user.update({
                where: { email },
                data: { bookedVisits },
            });
            return res.status(200).json({
                message: 'Booking cancelled successfully',
            });
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while cancelling the booking',
            error: error.message,
        });
    }
};

//to add rsed in favorite list of user

export const toFavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const { rid } = req.params;

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the residency is already in favorites
        const isFavorite = user.favResidenciesID.includes(rid);

        // Update the user's favorite residencies
        const updatedFavResidenciesID = isFavorite
            ? user.favResidenciesID.filter((id : any) => id !== rid)
            : [...user.favResidenciesID, rid];

        const updateUser = await prisma.user.update({
            where: { email },
            data: {
                favResidenciesID: updatedFavResidenciesID,
            },
        });

        res.status(200).json({
            message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
            user: updateUser,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// get all fav list
export const getAllFavorites = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        const favRsd = await prisma.user.findUnique({
            where: { email },
            select: { favResidenciesID: true },
        });

        res.status(200).json({
            message: 'Success',
            favRsd,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
