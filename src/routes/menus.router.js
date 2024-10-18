import { prisma } from "../utils/prisma/index.js";
import express from "express";

const router = express.Router();

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

    // 배열 형식으로 응답 보내기 - 안하면 no rows 나옴
    res.status(200).json({ menus: menus });
  } catch (error) {
    res.status(400).json({ message: "메뉴 조회에 실패했습니다." });
  }
});

// router.get("/", (req, res, next) => {
//   res.status(200).json({
//     menus: [
//       {
//         id: 1,
//         name: "Latte",
//         type: "Coffee",
//         temperature: "hot",
//         price: 4500,
//         totalOrders: 5,
//       },
//       {
//         id: 2,
//         name: "Iced Tea",
//         type: "Tea",
//         temperature: "ice",
//         price: 3000,
//         totalOrders: 10,
//       },
//     ],
//   });
// });

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
