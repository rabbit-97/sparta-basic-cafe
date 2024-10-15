import { PrismaClient } from "@prisma/client";
import express from "express";
const router = express.Router();

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});

// 주문 생성
router.post("/", async (req, res) => {
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
});

// 주문 조회
router.get("/", async (req, res) => {
  const orders = await prisma.orderHistory.findMany({
    include: {
      menu: true,
    },
  });
  res.status(200).json(orders);
});

// 주문 상세 조회
router.get("/:id", async (req, res) => {
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
});

// 주문 수정
router.put("/:id", async (req, res) => {
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
});

// 주문 삭제
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const order = await prisma.orderHistory.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json(order);
});

export default router;
