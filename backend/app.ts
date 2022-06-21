import { buildRouter } from "./routes/router";

const port = process.env.PORT || 5000;

buildRouter().listen(port, () => {
  console.log(`Listening on port ${port}`);
});
