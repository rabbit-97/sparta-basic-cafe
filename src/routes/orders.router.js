import { prisma } from "../utils/prisma/index.js";
import express from "express";
const router = express.Router();

// 주문 생성
router.post("/", async (req, res) => {
  try {
    const { menu } = req.body;
    const order = await prisma.orderHistory.create({
      data: {
        menu: {
          connect: {
            id: menu,
          },
        },
      },
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: "주문 생성에 실패했습니다." });
  }
});

// 주문 조회
router.get("/", async (req, res) => {
  try {
    const orders = await prisma.orderHistory.findMany({
      include: {
        menu: true,
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: "주문 조회에 실패했습니다." });
  }
});

// 주문 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.orderHistory.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        menu: true,
      },
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: "주문 조회에 실패했습니다." });
  }
});

// 주문 수정
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { menu } = req.body;
    const order = await prisma.orderHistory.update({
      where: {
        id: parseInt(id),
      },
      data: {
        menu: {
          connect: {
            id: menu,
          },
        },
      },
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: "주문 수정에 실패했습니다." });
  }
});

// 주문 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.orderHistory.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: "주문 삭제에 실패했습니다." });
  }
});

export default router;
