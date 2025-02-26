import { describe, it, expect } from "vitest";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Layer from "effect/Layer";
import * as Effect from "effect/Effect";
import * as HybridCartClient from "../src/effect/services/HybridCartClient";

import { makeMockLayerResponse, defineGlobals } from "./utils";
import { CartClearResponse } from "./responseData/clear";

describe("should return an empty cart response", () => {
  defineGlobals();

  it("should return the a cleared cart", async () => {
    const runtime = ManagedRuntime.make(
      Layer.merge(
        HybridCartClient.Default,
        makeMockLayerResponse(CartClearResponse),
      ),
    );

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.clear();
    });

    const cart = await runtime.runPromise(program);

    expect(cart.data?.items).toHaveLength(0);
  });
});
