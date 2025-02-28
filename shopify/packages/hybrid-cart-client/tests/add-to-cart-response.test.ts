import { describe, vi, it, expect } from "vitest";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Layer from "effect/Layer";
import * as Effect from "effect/Effect";
import * as HybridCartClient from "../src/effect/services/HybridCartClient";

import { makeMockLayerResponse, defineGlobals } from "./utils";

import { OneItemResponse, MultipleItemResponse } from "./responseData/add";

describe("add item/items to cart responses", async () => {
  defineGlobals();

  it("should return a single item", async () => {
    const runtime = ManagedRuntime.make(
      Layer.merge(
        HybridCartClient.Default,
        makeMockLayerResponse(OneItemResponse),
      ),
    );

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.add({
        sections: "main-product,review-section",
        items: [
          {
            id: 44632334565593,
            quantity: 1,
          },
        ],
      });
    });

    const cart = await runtime.runPromise(program);

    expect(cart.data?.items).toHaveLength(1);
    expect(cart.data?.items?.at(0)?.id).toEqual(
      OneItemResponse.items.at(0)?.id,
    );
  });

  it("should return multiple items", async () => {
    const runtime = ManagedRuntime.make(
      Layer.mergeAll(
        HybridCartClient.Default,
        makeMockLayerResponse(MultipleItemResponse),
      ),
    );

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.add({
        items: [
          {
            id: 44632334565593,
            quantity: 1,
          },
          {
            id: 44632334598361,
            quantity: 1,
          },
        ],
      });
    });

    const cart = await runtime.runPromise(program);

    expect(cart.data?.items).toHaveLength(2);
    cart.data?.items?.forEach((item, index) => {
      const matchingItem = MultipleItemResponse.items.at(index);
      return expect(item.id).toEqual(matchingItem?.id);
    });
  });
});
