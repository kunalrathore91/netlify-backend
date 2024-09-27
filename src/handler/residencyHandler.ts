import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../config/prismaConfig';
import { StatusCodes } from 'http-status-codes';

export const createResidency = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, price, address, city, country, image, facilities, userEmail } =
        req.body.data || req.body;
    try {
        const createResidency = await prisma.residency.create({
            data: {
                title,
                description,
                price,
                address,
                city,
                country,
                image,
                facilities,
                owner: { connect: { email: userEmail } },
            },
        });
        res.status(StatusCodes.CREATED).json({
            message: 'Residency Create successfully',
            success: true,
            createResidency,
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(StatusCodes.CONFLICT).json({
                message: 'Residency with this address already exists.',
                success: false,
            });
        }
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal Server Error',
            success: false,
        });
        next(error);
    }
};

export const getAllResidencies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const residencies = await prisma.residency.findMany({
            orderBy: {
                country: 'desc',
            },
        });
        res.status(StatusCodes.OK).json({
            residencies,
            success: true
        })
    } catch (error: any) {
        console.error(error);
        next(error);
    }
};

export const getResidencyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const residency = await prisma.residency.findUnique({
            where: { id },
        });

        if (!residency) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Residency not found with the provided ID.',
                success: false,
            });
        }
        res.status(StatusCodes.OK).json({
            message: 'Residency retrieved successfully.',
            success: true,
            data: residency,
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal Server Error',
            success: false,
        });
        next(error);
    }
};
