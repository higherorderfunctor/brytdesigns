import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as StorefrontClient from "@solidifront/storefront-client/effect";

import * as Resource from "@repo/shopify-utils/effect/Resource";
import { StorefrontClientConfig } from "@repo/shopify-utils/effect/Ajax";

import * as LoggerUtils from "../logger/LoggerUtils";
import * as AjaxClientResponse from "../data/AjaxClientResponse";
import { CartError } from "../errors";
import { CartGet } from ".";
import { CartUpdateDiscountsInput } from "../schema";

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

export type Input = CartUpdateDiscountsInput;

export const make = (discountCodes: CartUpdateDiscountsInput) =>
  Effect.gen(function* () {
    const config = new StorefrontClientConfig();
    const client = yield* StorefrontClient.make({
      storeName: config.shopName,
      publicAccessToken: config.accessToken,
      apiVersion: config.apiVersion as any,
    });
    const codes = yield* Schema.decode(CartUpdateDiscountsInput)(discountCodes);

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

    const response = yield* client.mutate(updateCartDiscountCodesMutation, {
      variables: {
        discountCodes: codes,
        id,
      },
    });

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

    if ((response.data?.cartDiscountCodesUpdate?.userErrors || []).length > 0) {
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
    LoggerUtils.withNamespacedLogSpan("discounts.update"),
    Effect.provide(StorefrontClient.layer),
  );
