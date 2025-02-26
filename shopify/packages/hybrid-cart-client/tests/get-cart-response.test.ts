import { describe, it, expect } from "vitest";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Layer from "effect/Layer";
import * as Effect from "effect/Effect";
import * as HybridCartClient from "../src/effect/services/HybridCartClient";

import { makeMockLayerResponse, defineGlobals } from "./utils";

import { CartResponse } from "./responseData/get";

describe("should return full cart response", () => {
  defineGlobals();

  it("should return the entire cart", async () => {
    const runtime = ManagedRuntime.make(
      Layer.merge(
        HybridCartClient.Default,
        makeMockLayerResponse(CartResponse),
      ),
    );

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.get();
    });

    const cart = await runtime.runPromise(program);

    expect(cart.data?.items).toHaveLength(1);
    expect(cart.data?.items?.at(0)?.id).toEqual(CartResponse.items.at(0)?.id);
  });
});
