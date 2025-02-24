import { CartUpdateInput, CartUpdateOutput } from "../schema.js";

import * as AjaxRequest from "./AjaxRequest.js";

export const make = AjaxRequest.makeFactory({
  routeName: "cart_update_url",
  method: "post",
  inputSchema: CartUpdateInput,
  outputSchema: CartUpdateOutput,
});
