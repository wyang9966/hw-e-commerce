import "dotenv/config";
import express from "express";
import cors from "cors";
import { NotFoundError, errorMiddleware } from "./core/errors";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ message: "Lecture E-Commerce API is running", port: PORT });
});

// 404
app.use((_req, _res, next) => next(new NotFoundError()));

// Error handler (must be last)
app.use(errorMiddleware as any);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
