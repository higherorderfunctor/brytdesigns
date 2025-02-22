import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as StorefrontClient from "@solidifront/storefront-client/effect";
import * as Layer from "effect/Layer";
import * as Resource from "@repo/shopify-utils/effect/Resource";
import { StorefrontClientConfig } from "@repo/shopify-utils/effect/Ajax/Window";

import * as AjaxRequest from "./AjaxRequest.js";
import * as CartAdd from "./CartAdd.js";
import * as CartChange from "./CartChange.js";
import * as CartClear from "./CartClear.js";
import * as CartGet from "./CartGet.js";
import * as CartUpdate from "./CartUpdate.js";
import * as LoggerUtils from "./LoggerUtils.js";
import { CartUpdateDiscountsInput } from "../schema.js";
import { CartError } from "../errors.js";
import { AjaxClientResponse } from "../data";

const updateCartDiscountCodesMutation = `#graphql
  mutation updateCartDiscounts($id: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $id, discountCodes: $discountCodes) {
      userErrors {
        field
        message
      }
    }
  }
`;

export const make = Effect.gen(function* () {
  const storefrontClientConfig = new StorefrontClientConfig();
  const storefrontClient = yield* StorefrontClient.make({
    storeName: storefrontClientConfig.shopName,
    publicAccessToken: storefrontClientConfig.accessToken,
    apiVersion: storefrontClientConfig.apiVersion as any,
  });

  const updateDiscounts = (discountCodes: CartUpdateDiscountsInput) =>
    Effect.gen(function* () {
      const codes = yield* Schema.decode(CartUpdateDiscountsInput)(
        discountCodes,
      );

      const initialCart = yield* CartGet.make();

      if (!initialCart.data) {
        if (initialCart.error) return yield* Effect.fail(initialCart.error);
        return AjaxClientResponse.make({
          error: new CartError({
            status: 404,
            message: "Cart not found",
            description: "Could not find the cart to update the discount codes",
          }),
        });
      }

      const id = yield* Resource.format({
        id: initialCart.data.token,
        type: "Cart",
      });

      const response = yield* storefrontClient.mutate(
        updateCartDiscountCodesMutation,
        {
          variables: {
            discountCodes: codes,
            id,
          },
        },
      );

      if (response.errors) {
        return AjaxClientResponse.make({
          error: new CartError({
            status: response.errors.networkStatusCode || 500,
            message: response.errors.message || "Unknown error",
            description:
              response.errors.graphQLErrors
                ?.map((error) => error.message)
                .join(", ") || "No errors reported",
          }),
        });
      }

      if (
        (response.data?.cartDiscountCodesUpdate?.userErrors || []).length > 0
      ) {
        return AjaxClientResponse.make({
          error: new CartError({
            status: 500,
            message: "Failed to update cart discount codes",
            description:
              response.data?.cartDiscountCodesUpdate?.userErrors
                .map((error) => error.message)
                .join(", ") || "No errors reported",
          }),
        });
      }

      return yield* CartGet.make();
    }).pipe(
      Effect.provide(LoggerUtils.Default),
      LoggerUtils.withNamespacedLogSpan("discounts.update"),
    );

  return {
    add: CartAdd.make,
    change: CartChange.make,
    clear: CartClear.make,
    get: CartGet.make,
    update: CartUpdate.make,
    discounts: {
      update: updateDiscounts,
    },
  };
});

export const Default = Layer.mergeAll(AjaxRequest.Default);
