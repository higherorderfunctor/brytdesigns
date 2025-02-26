import { describe, vi, it, expect } from "vitest";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Layer from "effect/Layer";
import * as Effect from "effect/Effect";
import * as HybridCartClient from "../src/effect/services/HybridCartClient";

import { defineGlobals, makeMockLayerResponse } from "./utils";
import {
  ItemResponse,
  NoteResponse,
  AttributesResponse,
} from "./responseData/update";

describe("update item cart responses", () => {
  defineGlobals();

  it("should return an update cart with a item changelog", async () => {
    const runtime = ManagedRuntime.make(
      Layer.mergeAll(
        HybridCartClient.Default,
        makeMockLayerResponse(ItemResponse),
      ),
    );

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.update({
        updates: {
          44632334565593: 1,
        },
      });
    });

    const cart = await runtime.runPromise(program);

    expect(cart.data?.items_changelog.added.at(0)).toEqual(
      ItemResponse.items_changelog.added.at(0),
    );
  });

  it("should return a cart with an updated note", async () => {
    const runtime = ManagedRuntime.make(
      Layer.mergeAll(
        HybridCartClient.Default,
        makeMockLayerResponse(NoteResponse),
      ),
    );

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.update({
        note: "Wow",
      });
    });

    const cart = await runtime.runPromise(program);

    expect(cart?.data?.note).toEqual(NoteResponse.note);
  });

  it("should return a cart with updated attributes", async () => {
    const runtime = ManagedRuntime.make(
      Layer.mergeAll(
        HybridCartClient.Default,
        makeMockLayerResponse(AttributesResponse),
      ),
    );

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.update({
        attributes: {
          test: "testing",
        },
      });
    });

    const cart = await runtime.runPromise(program);

    expect(cart?.data?.attributes.public).toEqual(
      AttributesResponse.attributes,
    );
  });
});
