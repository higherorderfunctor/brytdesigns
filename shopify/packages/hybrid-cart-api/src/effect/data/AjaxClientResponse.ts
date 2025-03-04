import type { CartError } from "../errors";

import * as Data from "effect/Data";

interface IAjaxClientResponse<TData = any> {
  data?: TData;
  error?: CartError;
}

export class AjaxClientResponse<TData = any> extends Data.Class<
  IAjaxClientResponse<TData>
> { }

export const make = <TData = undefined>(
  data: Parameters<ReturnType<typeof Data.case<AjaxClientResponse<TData>>>>[0],
) => Data.case<AjaxClientResponse<TData>>()(data);
