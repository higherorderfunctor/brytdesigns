import * as CartAdd from "./api/CartAdd.js";
import * as CartChange from "./api/CartChange.js";
import * as CartClear from "./api/CartClear.js";
import * as CartGet from "./api/CartGet.js";
import * as CartUpdate from "./api/CartUpdate.js";
import * as CartDiscountsUpdate from "./api/CartDiscountsUpdate.js";
import type { CartUpdateDiscountsInput } from "./schema.js";
import type { Effect } from "effect";
import type { CartError } from "./errors.js";

export namespace add {
  export type Input = CartAdd.Input;
}
export const add = CartAdd.make;

export namespace change {
  export type Input = CartChange.Input;
}
export const change = CartChange.make;

export namespace clear {
  export type Input = CartClear.Input;
}
export const clear = CartClear.make;

export namespace get {
  export type Input = CartGet.Input;
}
export const get = CartGet.make;

export namespace update {
  export type Input = CartUpdate.Input;
}
export const update = CartUpdate.make;

export namespace discounts {
  export type update = {
    Input: CartDiscountsUpdate.Input;
  };
}

export const discounts: {
  update: (discountCodes: CartUpdateDiscountsInput) => Effect.Effect<Effect.Effect.Success<ReturnType<typeof CartGet.make>>, Effect.Effect.Error<ReturnType<typeof CartGet.make>> | CartError | CartDiscountsUpdate.ExtractOperationNameError>
} = {
  update: CartDiscountsUpdate.make,
};
