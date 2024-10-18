import express from "express";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

// /api/stats - 수정 끝
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

// api/menus/stats
// router.get("/stats", (req, res, next) => {
//     res.status(200).json({
//       stats: {
//         totalMenus: 3,
//         totalOrders: 10,
//         totalSales: 30000,
//       },
//     });
//   });

//   const menus = [
//     {
//       id: 1,
//       name: "Latte",
//       type: "Coffee",
//       temperature: "hot",
//       price: 4500,
//       totalOrders: 5,
//     },
//     {
//       id: 2,
//       name: "Iced Tea",
//       type: "Tea",
//       temperature: "ice",
//       price: 3000,
//       totalOrders: 10,
//     },
//   ];

// get/api/menus - 수정 완료
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

// get/api/menus/:id
// 수정 완료, 테스트 완료

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
    res.status(400).json({ message: "주문 조회에 실패했습니다." });
  }
});

// router.get("/:menuId", (req, res, next) => {
//   const id = req.params.menuId;
//   const menu = menus[0];

//   res.status(200).json({
//     menu,
//   });
// });

// post/api/menus/ - 수정 완료, 테스트 x
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

// put/api/menus/:menuId - 수정 완료 , 테스트 x
// 홈페이지 오류 - 숫자는 이제 변경이 잘 되나 이름이 변경 안됨
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, temperature } = req.body;
    const { price } = req.body;

    price = parseFloat(price);

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

// delete/api/menus/:menuId - 수정 완료, 테스트 완료
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

// router.delete('/:menuId', (req, res, next) => {
//     const id = req.params.menuId;
//     console.log(req.body)

//     res.status(200).json({
//         message: `메뉴 ${id} 삭제되었습니다.`
//     });
// });

export default router;
