import { describe, vi, it, expect } from "vitest";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Layer from "effect/Layer";
import * as Effect from "effect/Effect";
import * as HybridCartClient from "../src/effect/services/HybridCartClient";

import { defineGlobals, makeMockLayerResponse } from "./utils";
import {
  PropertyAddedResponse,
  PropertyRemovedResponse,
  PublicPrivatePropertyResponse,
  QuantityAddedResponse,
  QuantityRemovedResponse,
} from "./responseData/change";

describe("change item cart responses", () => {
  defineGlobals();

  it("should return a cart with an items_added array of length 1", async () => {
    const runtime = ManagedRuntime.make(
      Layer.mergeAll(
        HybridCartClient.Default,
        makeMockLayerResponse(QuantityAddedResponse),
      ),
    );

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.change({
        id: "44632334532825:694d7922f57542e3e5efd64e76235e37",
        quantity: 2,
      });
    });

    const cart = await runtime.runPromise(program);

    expect(cart.data?.items_added?.at(0)?.id).toEqual(
      QuantityAddedResponse.items_added.at(0)?.id,
    );
  });

  it("should return a cart with an items_removed array of length 1", async () => {
    const runtime = ManagedRuntime.make(
      Layer.mergeAll(
        HybridCartClient.Default,
        makeMockLayerResponse(QuantityRemovedResponse),
      ),
    );

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.change({
        id: "44632334532825:cff167159b370c03ae797b0790018d64",
        quantity: 0,
      });
    });

    const cart = await runtime.runPromise(program);

    expect(cart.data?.items_removed?.at(0)?.id).toEqual(
      QuantityRemovedResponse.items_removed.at(0)?.id,
    );
  });

  it("first item should have a property of 'test'", async () => {
    const runtime = ManagedRuntime.make(
      Layer.mergeAll(
        HybridCartClient.Default,
        makeMockLayerResponse(PropertyAddedResponse),
      ),
    );

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.change({
        id: "44632334532825:694d7922f57542e3e5efd64e76235e37",
        properties: {
          test: "testing",
        },
      });
    });

    const cart = await runtime.runPromise(program);

    expect(cart.data?.items?.at(0)?.properties?.public).toHaveProperty("test");
    expect(cart.data?.items?.at(0)?.properties?.public.test).toEqual("testing");

    expect(cart.data?.items?.at(0)?.properties?.public.test).toEqual(
      PropertyAddedResponse.items.at(0)?.properties.test,
    );
  });

  it("first item shouldn't have any properties", async () => {
    const runtime = ManagedRuntime.make(
      Layer.mergeAll(
        HybridCartClient.Default,
        makeMockLayerResponse(PropertyRemovedResponse),
      ),
    );

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.change({
        id: "44632334532825:4c36eea30c69476d5d743a56c1fe94fd",
        properties: {
          test: null,
        },
      });
    });

    const cart = await runtime.runPromise(program);
    console.log(cart.data?.items?.at(0)?.properties);

    expect(cart.data?.items?.at(0)?.properties?.public).toHaveProperty("test");
    expect(cart.data?.items?.at(0)?.properties?.public.test).toEqual(null);

    expect(cart.data?.items?.at(0)?.properties?.public).toEqual(
      PropertyRemovedResponse.items.at(0)?.properties,
    );
  });

  it("should return an item with public and private properties", async () => {
    const runtime = ManagedRuntime.make(
      Layer.mergeAll(
        HybridCartClient.Default,
        makeMockLayerResponse(PublicPrivatePropertyResponse),
      ),
    );

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.change({
        id: "44632334532825:76d6ada02c889846b3d0be445145e0bc",
        properties: {
          test: "testing1",
          _test: "testing2",
        },
      });
    });

    const cart = await runtime.runPromise(program);

    expect(cart.data?.items?.at(0)?.properties?.public).toHaveProperty("test");
    expect(cart.data?.items?.at(0)?.properties?.public.test).toEqual(
      "testing1",
    );

    expect(cart.data?.items?.at(0)?.properties?.private).toHaveProperty("test");
    expect(cart.data?.items?.at(0)?.properties?.private.test).toEqual(
      "testing2",
    );
  });
});
