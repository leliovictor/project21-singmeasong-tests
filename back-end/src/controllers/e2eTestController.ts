import { Request, Response } from "express";

import * as service from "../services/e2eTestService.js";

export async function eraseDatabase(_req: Request, res: Response) {
  await service.eraseDatabase();
  return res.sendStatus(200);
}
