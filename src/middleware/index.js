import { applyMiddleware } from "redux";
import myLogger from "./myLogger";
import logger from "redux-logger";

export default applyMiddleware(myLogger, logger);
