import { PrismaClient } from "@prisma/client";
import express from "express";
const router = express.Router();

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});

router.get("/stats", async (req, res, next) => {
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

// 메뉴 생성
router.post("/", async (req, res) => {
  const { name, type, temperature, price } = req.body;
  const menu = await prisma.menu.create({
    data: {
      name,
      type,
      temperature,
      price,
    },
  });
  res.status(201).json(menu);
});

// 메뉴 조회
router.get("/", async (req, res) => {
  const menus = await prisma.menu.findMany();
  res.status(200).json(menus);
});

// 메뉴 상세 조회
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const menu = await prisma.menu.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json(menu);
});

// 메뉴 수정
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, temperature, price } = req.body;
  const menu = await prisma.menu.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      type,
      temperature,
      price,
    },
  });
  res.status(200).json(menu);
});

// 메뉴 삭제
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const menu = await prisma.menu.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json(menu);
});

export default router;
