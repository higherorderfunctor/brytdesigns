import * as Data from "effect/Data";

export class CartError extends Data.TaggedError(
  "@brytdesigns/hybrid-cart-client/CartError",
)<{
  status: number;
  message: string;
  description: string;
}> { }
