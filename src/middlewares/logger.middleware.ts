import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`METHOD: ${req.method} - Ejecutado en la ruta: ${req.url}`);
    }
}

export function LoggerGlobal(req: Request, res: Response, next: NextFunction) {
  console.log(`METHOD: ${req.method} - Ejecutado en la ruta: ${req.url}`);
  next();
}