import { NextFunction, Response } from "express";
import { AuthRequest } from "../../interfaces/types";

export const adminPermission = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userType && req.userType === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admins only" });
  }
};
