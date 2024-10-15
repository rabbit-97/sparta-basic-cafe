import { PrismaClient } from "@prisma/client";
import express from "express";
const router = express.Router();

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});

// 메뉴 생성
router.post("/", async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ message: "메뉴 생성에 실패했습니다." });
  }
});

// 메뉴 조회
router.get("/", async (req, res) => {
  try {
    const menus = await prisma.menu.findMany();
    res.status(200).json(menus);
  } catch (error) {
    res.status(400).json({ message: "메뉴 조회에 실패했습니다." });
  }
});

// 메뉴 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await prisma.menu.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ message: "메뉴 조회에 실패했습니다." });
  }
});

// 메뉴 수정
router.put("/:id", async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ message: "메뉴 수정에 실패했습니다." });
  }
});

// 메뉴 삭제
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
