import {
  CartAdd,
  CartChange,
  CartClear,
  CartDiscountsUpdate,
  CartGet,
  CartUpdate,
} from "./api";

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

export const discounts = {
  update: CartDiscountsUpdate.make,
};
