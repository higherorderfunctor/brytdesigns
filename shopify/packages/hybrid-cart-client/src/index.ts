import type {
  CartAddInput,
  CartChangeInput,
  CartClearInput,
  CartGetInput,
  CartUpdateInput,
} from "./effect";

import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";

import * as HybridCartClient from "./effect/services/HybridCartClient";

export namespace createHybridCartClient {
  export type Options = {
    logger?: Parameters<typeof Logger.make>[0];
  };

  export type RequestOptions = {
    signal?: AbortSignal;
  };
}

export const createHybridCartClient = (
  initOptions?: createHybridCartClient.Options,
) => {
  const layer = HybridCartClient.Default;

  return {
    add: (
      input: CartAddInput,
      options?: createHybridCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* HybridCartClient.make;
          return yield* client.add(input);
        }).pipe(Effect.provide(layer)),
      ),
    change: (
      input: CartChangeInput,
      options?: createHybridCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* HybridCartClient.make;
          return yield* client.change(input);
        }).pipe(Effect.provide(layer)),
        {
          signal: options?.signal,
        },
      ),
    clear: (
      input: CartClearInput,
      options?: createHybridCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* HybridCartClient.make;
          return yield* client.clear(input);
        }).pipe(Effect.provide(layer)),
        {
          signal: options?.signal,
        },
      ),
    get: (
      input: CartGetInput,
      options?: createHybridCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* HybridCartClient.make;
          return yield* client.get(input);
        }).pipe(Effect.provide(layer)),
        {
          signal: options?.signal,
        },
      ),
    update: (
      input: CartUpdateInput,
      options?: createHybridCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        Effect.gen(function* () {
          const client = yield* HybridCartClient.make;
          return yield* client.update(input);
        }).pipe(Effect.provide(layer)),
        {
          signal: options?.signal,
        },
      ),
    discounts: {
      update: (
        discountCodes: string[],
        options?: createHybridCartClient.RequestOptions,
      ) =>
        Effect.runPromise(
          Effect.gen(function* () {
            const client = yield* HybridCartClient.make;
            return yield* client.discounts.update(discountCodes);
          }).pipe(Effect.provide(layer)),
          {
            signal: options?.signal,
          },
        ),
    },
  };
};
