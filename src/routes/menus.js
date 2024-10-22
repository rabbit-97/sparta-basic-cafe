import express from "express";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

// 통계치 계산
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

// 데이터 가져오기
router.get("/", async (req, res) => {
  try {
    const menu = await prisma.menu.findMany({
      include: {
        orders: true,
      },
    });

    const menus = menu.map((menu) => ({
      id: menu.id,
      name: menu.name,
      type: menu.type,
      temperature: menu.temperature,
      price: menu.price,
      totalOrders: menu.orders.length,
    }));

    res.status(200).json({ menus: menus });
  } catch (error) {
    res.status(400).json({ message: "메뉴 조회에 실패했습니다." });
  }
});

// 특정 데이터 가져오기
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("요청 ID:", id);

    if (!id || isNaN(id) || id === "undefined") {
      return res.status(400).json({ message: "유효하지 않은 ID입니다." });
    }

    const menu = await prisma.menu.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!menu) {
      return res.status(404).json({ message: "메뉴를 찾을 수 없습니다." });
    }

    res.status(200).json(menu);
  } catch (error) {
    console.error("주문 조회 에러:", error);
    res.status(400).json({ message: "주문 조회에 실패했습니다." });
  }
});

// 데이터 생성
router.post("/", async (req, res) => {
  try {
    const { name, type, temperature } = req.body;
    let { price } = req.body;

    price = parseFloat(price);

    const menu = await prisma.menu.create({
      data: {
        name,
        type,
        temperature,
        price: price,
      },
    });
    res.status(201).json(menu);
  } catch (error) {
    res.status(400).json({ message: "메뉴 생성에 실패했습니다." });
  }
});

// 데이터 수정
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, temperature } = req.body;
    let { price } = req.body;

    price = parseFloat(price);

    const menu = await prisma.menu.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        type,
        temperature,
        price: price,
      },
    });
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ message: "메뉴 수정에 실패했습니다." });
  }
});

// 데이터 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await prisma.menu.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ message: "메뉴 삭제에 실패했습니다." });
  }
});

export default router;
