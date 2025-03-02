import { Cart, CartGetInput } from "../schema.js";

import * as AjaxRequest from "../services/AjaxRequest.js";

export type Input = CartGetInput;

export const make = AjaxRequest.makeFactory({
  routeName: "cart_url",
  method: "get",
  inputSchema: CartGetInput,
  outputSchema: Cart,
});
