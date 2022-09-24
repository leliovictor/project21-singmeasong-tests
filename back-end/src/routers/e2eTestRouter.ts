import { Router } from "express";

import * as controller from "../controllers/e2eTestController.js";

const testRouter = Router();

testRouter.post("/eraseDatabase", controller.eraseDatabase);

export default testRouter;