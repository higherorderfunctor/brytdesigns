import { CartChangeInput } from "../schema.js";

import * as AjaxRequest from "./AjaxRequest.js";

export const make = AjaxRequest.makeFactory({
  routeName: "cart_change_url",
  method: "post",
  inputSchema: CartChangeInput,
});
