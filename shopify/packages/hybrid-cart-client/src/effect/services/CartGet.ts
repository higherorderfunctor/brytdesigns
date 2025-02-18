import { CartGetInput } from "../schema.js";

import * as AjaxRequest from "./AjaxRequest.js";

export const make = AjaxRequest.makeFactory({
  routeName: "cart_url",
  method: "post",
  inputSchema: CartGetInput,
});
