import { prisma } from "../utils/prisma/index.js";
import express from "express";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    // 메뉴의 총 개수
    const totalMenus = await prisma.menu.count();

    // 총 주문 횟수
    const totalOrders = await prisma.orderHistory.count();

    // 모든 주문 내역
    const orders = await prisma.orderHistory.findMany({
      include: {
        menu: true,
      },
    });

    // 총 매출 계산
    let totalSales = 0;
    orders.forEach((order) => {
      totalSales += order.menu.price;
    });

    // 통계 반환
    res.status(200).json({
      stats: {
        totalMenus,
        totalOrders,
        totalSales,
      },
    });
  } catch (error) {
    next(error);
  }
});

// router.get("/", (req, res, next) => {
//   res.status(200).json({
//     stats: {
//       totalMenus: 3,
//       totalOrders: 10,
//       totalSales: 30000,
//     },
//   });
// });

export default router;
