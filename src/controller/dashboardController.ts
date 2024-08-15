
import { Room } from "../models/Room";
import { User } from "../models/User";
import { Booking } from "../models/Booking";
import { Request, Response } from "express";

const getMonthName = (month: number) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[month];
}

export const getDashboardData = async (req: Request, res: Response) => {
    try{
        const totalRooms = await Room.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalRevenueResult = await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    total: {$sum: "$totalPrice"}
                }
            }
        ])
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
        const today = new Date();
        today.setHours(0,0,0,0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const currentBookings = await Booking.countDocuments({
            startDate: {$lt: tomorrow},
            endDate: {$gt: today}
        })

        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0,0,0,0);

        const previousMonth = new Date(currentMonth);
        previousMonth.setMonth(previousMonth.getMonth() - 1);

        const currentMonthData = await Booking.aggregate([
            {
                $match: {
                    startDate: {$gte: currentMonth}
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {$sum: "$totalPrice"},
                    totalBookings: {$sum: 1}
                }
            }
        ])

        const previousMonthData = await Booking.aggregate([
            {
                $match: {
                    startDate: {$gte: previousMonth, $lt: currentMonth}
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {$sum: "$totalPrice"},
                    totalBookings: {$sum: 1}
                }
            }
        ])

        const currentMonthRevenue = currentMonthData.length > 0 ? currentMonthData[0].totalRevenue : 0;
        const previousMonthRevenue = previousMonthData.length > 0 ? previousMonthData[0].totalRevenue : 0;
        const currentMonthBookings = currentMonthData.length > 0 ? currentMonthData[0].totalBookings : 0;
        const previousMonthBookings = previousMonthData.length > 0 ? previousMonthData[0].totalBookings : 0;

        const revenueIncreaseRate = previousMonthRevenue > 0 ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0;
        const bookingIncreaseRate = previousMonthBookings > 0 ? ((currentMonthBookings - previousMonthBookings) / previousMonthBookings) * 100 : 0;

        const tweleveMonthsAgo = new Date();
        tweleveMonthsAgo.setMonth(tweleveMonthsAgo.getMonth() - 12);
        const monthlyData = await Booking.aggregate([
            {
                $match: {
                    startDate: {$gte: tweleveMonthsAgo}
                }
            },
            {
                $group: {
                    _id: {
                        month: {$month: "$startDate"},
                        year: {$year: "$startDate"}
                    },
                    totalRevenue: {$sum: "$totalPrice"}
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ])
        res.json({
            totalRooms, 
            totalUsers, 
            totalBookings,
            totalRevenue, 
            currentBookings,
            revenueIncreaseRate,
            bookingIncreaseRate,
            monthlyData: monthlyData.map((data: any) => {
                return {
                    month: `${getMonthName(data._id.month)} ${data._id.year}`,
                    totalRevenue: data.totalRevenue
                }
        })
        })

    }catch(error){
        res.json({message: `Error ${error}`})
    }
}
const ITEMS_PER_PAGE = 6;
export const fetchFilteredRooms = async (req: Request, res: Response) => {
    const { query, currentPage } = req.query;
    const page = parseInt(currentPage as string) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    try{
        const searchCriteria : any = {
            $or: [
                {title: {$regex: query as string, $options: 'i'}},
                {location: {$regex: query as string, $options: 'i'}},
                {roomNumber: {$regex: query as string, $options: 'i'}},
                {status: {$regex: query as string, $options: 'i'}},
            ]
        };
        if(!isNaN(Number(query))){
            searchCriteria.$or.push(
                {price: Number(query)},
                {rating: Number(query)}
            )

        }

        const rooms = await Room.find(searchCriteria)
        .skip(offset)
        .limit(ITEMS_PER_PAGE)
        .exec();
        res.status(200).json(rooms);
    }catch(error){
        console.error('Database error', error);
        res.status(500).json({message: 'Failed to fetch rooms'});
    }
}

export const fetchRoomsPages = async (req: Request, res: Response) => {
    const { query } = req.query;
    try{
        const searchCriteria : any = {
            $or: [
                {title: {$regex: query as string, $options: 'i'}},
                {location: {$regex: query as string, $options: 'i'}},
                {roomNumber: {$regex: query as string, $options: 'i'}},
                {status: {$regex: query as string, $options: 'i'}},
            ]
        };
        if(!isNaN(Number(query))){
            searchCriteria.$or.push(
                {price: Number(query)},
                {rating: Number(query)}
            )
        }
        const totalRooms = await Room.countDocuments(searchCriteria);
        const pages = Math.ceil(totalRooms / ITEMS_PER_PAGE);
        res.status(200).json(pages);
    }catch(error){
        console.error('Database error', error);
        res.status(500).json({message: 'Failed to fetch rooms'});
    }
}