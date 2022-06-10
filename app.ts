import express from "express";
import path from "path";
import { buildApiRouter } from "./routes/api";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/api", buildApiRouter());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
