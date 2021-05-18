import { API_HOST } from "../constants";

import BetroApi from "betro-js-client";

const BetroApiObject = new BetroApi(API_HOST);

export default BetroApiObject;
