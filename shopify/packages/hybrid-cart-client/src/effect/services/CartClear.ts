import { Cart, CartClearInput } from "../schema.js";

import * as AjaxRequest from "./AjaxRequest.js";

export const make = AjaxRequest.makeFactory({
  routeName: "cart_clear_url",
  method: "post",
  inputSchema: CartClearInput,
  outputSchema: Cart,
});
