import express from "express";
import cors from "cors";
import helmet from "helmet";
import { runLighthouse } from "./lighthouse.js";

const app = express();
const router = express.Router();

const port = 8080;

router.use((req, _res, next) => {
  console.log("Handing Lighthouse Request");
  next();
});

router.post("/", async (req, res) => {
  try {
    const {
      body: { url, device },
    } = req;

    const report = await runLighthouse(url, device);

    res.status(200).send(report);
  } catch (err) {
    console.log("ERROR");
    console.log(err);

    res.status(500).send("Error");
  }
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", router);

app.listen(port, () => {
  console.log(`Lighthouse running on port ${port}`);
});
