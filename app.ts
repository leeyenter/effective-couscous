import express from "express";
import { buildApiRouter } from "./routes/api";
const app = express();
const port = 3000;

app.use(express.json());
app.use("/", express.static("public"));
app.use("/api", buildApiRouter());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
