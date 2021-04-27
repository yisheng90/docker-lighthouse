import * as express from "express";
import * as cors from "cors";
import * as helmet from "helmet";
import { runLighthouse } from "./services/lighthouse";

const app = express();
const router = express.Router();

const port = 8080;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

router.post("/", async ({ body: { url, device } }, res) => {
  try {
    const report = await runLighthouse(url, device);
    res.status(200).send(report);
  } catch (err) {
    console.log("ERROR");
    console.log(err);

    res.status(500).send("Error");
  }
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Lighthouse running on port ${port}`);
});
