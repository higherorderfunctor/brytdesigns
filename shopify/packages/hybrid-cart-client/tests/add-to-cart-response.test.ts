import { describe, vi, it, expect } from "vitest";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Layer from "effect/Layer";
import * as Effect from "effect/Effect";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HybridCartClient from "../src/effect/services/HybridCartClient";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";

const OneItemAddToCartResponse = {
  sections: {
    "cart-test": "",
  },
  items: [
    {
      id: 36323170943141,
      properties: null,
      quantity: 1,
      variant_id: 36323170943141,
      key: "36323170943141:322e2af74da821ca095964e07b7270b5",
      title: "Great Granola Bar",
      price: 1700,
      original_price: 1700,
      discounted_price: 1700,
      line_price: 1700,
      original_line_price: 1700,
      total_discount: 0,
      discounts: [],
      sku: "",
      grams: 0,
      vendor: "shopify",
      taxable: true,
      product_id: 5680114172069,
      product_has_only_default_variant: true,
      gift_card: false,
      final_price: 1700,
      final_line_price: 1700,
      url: "/products/great-granola-bar?selling_plan=6717605/u0026variant=36323170943141",
      featured_image: {
        aspect_ratio: 1.504,
        alt: "Great Granola Bar",
        height: 1277,
        url: "https://cdn.shopify.com/s/files/1/0401/3218/2181/products/fallon-michael-h2UH2674Bg4-unsplash.jpg?v=1600796940",
        width: 1920,
      },
      image:
        "https://cdn.shopify.com/s/files/1/0401/3218/2181/products/fallon-michael-h2UH2674Bg4-unsplash.jpg?v=1600796940",
      handle: "great-granola-bar",
      requires_shipping: true,
      product_type: "",
      product_title: "Great Granola Bar",
      product_description:
        "The great granola bar, everyone has been talking about it. Subscribe when you can!",
      variant_title: null,
      variant_options: ["Default Title"],
      options_with_values: [
        {
          name: "Title",
          value: "Default Title",
        },
      ],
      line_level_discount_allocations: [],
      line_level_total_discount: 0,
      selling_plan_allocation: {
        price_adjustments: [
          {
            position: 1,
            price: 1700,
          },
        ],
        price: 1700,
        compare_at_price: 2000,
        per_delivery_price: 1700,
        selling_plan: {
          id: 6717605,
          name: "Delivered every week",
          description: null,
          options: [
            {
              name: "Delivery every",
              position: 1,
              value: "1 Week(s)",
            },
          ],
          recurring_deliveries: true,
          price_adjustments: [
            {
              order_count: null,
              position: 1,
              value_type: "percentage",
              value: 15,
            },
          ],
        },
      },
    },
  ],
};

const MultiItemAddToCartResponse = {
  items: [
    {
      id: 36323170943141,
      properties: null,
      quantity: 1,
      variant_id: 36323170943141,
      key: "36323170943141:b15f59bb6d406f2f45dc383a5493bdb8",
      title: "Great Granola Bar",
      price: 2000,
      original_price: 2000,
      discounted_price: 2000,
      line_price: 2000,
      original_line_price: 2000,
      total_discount: 0,
      discounts: [],
      sku: "",
      grams: 0,
      vendor: "shopify",
      taxable: true,
      product_id: 5680114172069,
      product_has_only_default_variant: true,
      gift_card: false,
      final_price: 2000,
      final_line_price: 2000,
      url: "/products/great-granola-bar?variant=36323170943141",
      featured_image: {
        aspect_ratio: 1.504,
        alt: "Great Granola Bar",
        height: 1277,
        url: "https://cdn.shopify.com/s/files/1/0401/3218/2181/products/fallon-michael-h2UH2674Bg4-unsplash.jpg?v=1600796940",
        width: 1920,
      },
      image:
        "https://cdn.shopify.com/s/files/1/0401/3218/2181/products/fallon-michael-h2UH2674Bg4-unsplash.jpg?v=1600796940",
      handle: "great-granola-bar",
      requires_shipping: true,
      product_type: "",
      product_title: "Great Granola Bar",
      product_description:
        "The great granola bar, everyone has been talking about it. Subscribe when you can!",
      variant_title: null,
      variant_options: ["Default Title"],
      options_with_values: [
        {
          name: "Title",
          value: "Default Title",
        },
      ],
      line_level_discount_allocations: [],
      line_level_total_discount: 0,
    },
    {
      id: 36323170943141,
      properties: null,
      quantity: 1,
      variant_id: 36323170943141,
      key: "36323170943141:322e2af74da821ca095964e07b7270b5",
      title: "Great Granola Bar",
      price: 1700,
      original_price: 1700,
      discounted_price: 1700,
      line_price: 1700,
      original_line_price: 1700,
      total_discount: 0,
      discounts: [],
      sku: "",
      grams: 0,
      vendor: "shopify",
      taxable: true,
      product_id: 5680114172069,
      product_has_only_default_variant: true,
      gift_card: false,
      final_price: 1700,
      final_line_price: 1700,
      url: "/products/great-granola-bar?selling_plan=6717605/u0026variant=36323170943141",
      featured_image: {
        aspect_ratio: 1.504,
        alt: "Great Granola Bar",
        height: 1277,
        url: "https://cdn.shopify.com/s/files/1/0401/3218/2181/products/fallon-michael-h2UH2674Bg4-unsplash.jpg?v=1600796940",
        width: 1920,
      },
      image:
        "https://cdn.shopify.com/s/files/1/0401/3218/2181/products/fallon-michael-h2UH2674Bg4-unsplash.jpg?v=1600796940",
      handle: "great-granola-bar",
      requires_shipping: true,
      product_type: "",
      product_title: "Great Granola Bar",
      product_description:
        "The great granola bar, everyone has been talking about it. Subscribe when you can!",
      variant_title: null,
      variant_options: ["Default Title"],
      options_with_values: [
        {
          name: "Title",
          value: "Default Title",
        },
      ],
      line_level_discount_allocations: [],
      line_level_total_discount: 0,
      selling_plan_allocation: {
        price_adjustments: [
          {
            position: 1,
            price: 1700,
          },
        ],
        price: 1700,
        compare_at_price: 2000,
        per_delivery_price: 1700,
        selling_plan: {
          id: 6717605,
          name: "Delivered every week",
          description: null,
          options: [
            {
              name: "Delivery every",
              position: 1,
              value: "1 Week(s)",
            },
          ],
          recurring_deliveries: true,
          price_adjustments: [
            {
              order_count: null,
              position: 1,
              value_type: "percentage",
              value: 15,
            },
          ],
        },
      },
    },
  ],
};

const makeMockLayerResponse = (data: any) =>
  Layer.succeed(
    HttpClient.HttpClient,
    HttpClient.make((req) =>
      Effect.succeed(
        HttpClientResponse.fromWeb(
          req,
          new Response(JSON.stringify(data), {
            status: 200,
          }),
        ),
      ),
    ),
  );

const oneItemResponseLayer = Layer.mergeAll(
  HybridCartClient.Default,
  makeMockLayerResponse(OneItemAddToCartResponse),
);

const multipleItemResponseLayer = Layer.mergeAll(
  HybridCartClient.Default,
  makeMockLayerResponse(MultiItemAddToCartResponse),
);

describe("add item/items to cart responses", () => {
  vi.stubGlobal("window", {
    location: {
      origin: "https://example.com",
    },
    Shopify: {
      storefront: {
        config: {
          shopName: process.env.SHOPIFY_PUBLIC_STORE_NAME,
          apiVersion: process.env.SHOPIFY_PUBLIC_STOREFRONT_VERSION,
          accessToken: process.env.SHOPIFY_PUBLIC_STOREFRONT_TOKEN,
        },
      },
    },
  });

  it("should return a single item", async () => {
    const runtime = ManagedRuntime.make(oneItemResponseLayer);

    const program = Effect.gen(function* () {
      const client = yield* HybridCartClient.make;
      return yield* client.add({
        sections: "cart-test",
        items: [
          {
            id: 36323170943141,
            quantity: 1,
          },
        ],
      });
    });

    const cart = await runtime.runPromise(program);

    expect(cart.data?.items).toHaveLength(1);
    expect(cart.data?.items?.at(0)?.id).toEqual(
      OneItemAddToCartResponse.items.at(0)?.id,
    );
  });
});
