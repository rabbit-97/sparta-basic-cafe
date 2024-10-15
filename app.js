import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import indexRouter from "./routes/index.js";
import menusRouter from "./routes/menus.router.js";
import ordersRouter from "./routes/orders.router.js";
import statsRouter from "./routes/stats.router.js";

const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), "public")));

app.use("/", indexRouter);
app.use("/menus", menusRouter);
app.use("/orders", ordersRouter);
app.use("/stats", statsRouter);

export default app;
