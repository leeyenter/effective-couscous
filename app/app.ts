import express from "express";
import { engine } from "express-handlebars";
import { buildApiRouter } from "./routes/api";
const app = express();
const port = 3000;

// app.engine("handlebars", engine());
// app.set("view engine", "handlebars");
// app.set("views", "./views");
app.use("/", express.static("public"));
// app.use('/')

app.use(express.json());

app.get("/", (req, res) => res.render("home"));
app.use("/api", buildApiRouter());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
