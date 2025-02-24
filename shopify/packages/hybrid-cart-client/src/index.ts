import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as HybridCartClient from "./effect/services/HybridCartClient";
import * as ManagedRuntime from "effect/ManagedRuntime";
import type {
  CartAddInput,
  CartChangeInput,
  CartClearInput,
  CartGetInput,
  CartUpdateInput,
} from "./effect";

const mainLayer = Layer.mergeAll(HybridCartClient.Default);
const runtime = ManagedRuntime.make(mainLayer);

export const createHybridCartClient = () =>
  runtime.runSync(
    Effect.gen(function* () {
      const client = yield* HybridCartClient.make;

      return {
        add: (input: CartAddInput) => runtime.runPromise(client.add(input)),
        change: (input: CartChangeInput) =>
          runtime.runPromise(client.change(input)),
        clear: (input: CartClearInput) =>
          runtime.runPromise(client.clear(input)),
        get: (input: CartGetInput) => runtime.runPromise(client.get(input)),
        update: (input: CartUpdateInput) =>
          runtime.runPromise(client.update(input)),
        discounts: {
          update: (discountCodes: string[]) =>
            runtime.runPromise(client.discounts.update(discountCodes)),
        },
      };
    }),
  );
