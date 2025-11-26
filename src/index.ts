import "dotenv/config";
import express from "express";
import cors from "cors";
import { router as taskRoutes } from "./routes/tasks.ts";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use("/tasks", taskRoutes);

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Add this line

app.get("/", async (req, res) => {
  res.status(200).send("Bookydoo API v0.1");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
