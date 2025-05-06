// add temp varialbe to request
import { asyncHandler } from "../utils/asyncHandler.js";

export const addTempvar = asyncHandler((req, res, next) => {
    req.temp = "temporary variable added by middleware";
    console.log("middleware's req.temp value = ", req.temp);
    next();
    // return res.status(200).json({ message: "temp variable added by middleware" });
});