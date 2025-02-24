import { CartAddInput, CartAddOutput } from "../schema.js";

import * as AjaxRequest from "./AjaxRequest.js";

export const make = AjaxRequest.makeFactory({
  routeName: "cart_add_url",
  method: "post",
  inputSchema: CartAddInput,
  outputSchema: CartAddOutput,
});
