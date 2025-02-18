import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as Function from "effect/Function";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";

import * as AjaxSections from "@repo/shopify-utils/effect/Ajax/Sections";
import { ShopifyRoutes } from "@repo/shopify-utils/effect";

import { CartError } from "../errors.js";
import { makeCartSchema } from "../schema.js";
import { AjaxClientResponse } from "../data";

export const makeFactory =
  <A extends typeof AjaxSections.Input.Type, I, R>({
    inputSchema,
    routeName,
    method,
  }: {
    method: keyof Pick<typeof HttpClientRequest, "post" | "get">;
    routeName: keyof Pick<
      ShopifyRoutes,
      | "cart_add_url"
      | "cart_update_url"
      | "cart_url"
      | "cart_change_url"
      | "cart_clear_url"
    >;
    inputSchema: Schema.Schema<A, I, R>;
  }) =>
    <Input extends Schema.Schema<A, I, R>["Encoded"]>(input: Input) =>
      Effect.gen(function*() {
        const client = yield* HttpClient.HttpClient;
        const decodedInput = yield* Schema.decode(inputSchema)(input);
        const routes = new ShopifyRoutes();
        const route = routes[routeName];
        const schema = makeCartSchema(decodedInput.sections);

        let request: HttpClientRequest.HttpClientRequest;

        if (method === "post") {
          request = yield* HttpClientRequest.post(route, {
            acceptJson: true,
          }).pipe(HttpClientRequest.bodyJson(decodedInput));
        } else if (method === "get") {
          request = HttpClientRequest.get(route, {
            acceptJson: true,
          }).pipe(HttpClientRequest.setUrlParams(decodedInput));
        }

        //@ts-ignore
        const response = yield* client.execute(request).pipe(
          Effect.filterOrFail(
            (res) => res.status !== 200,
            (res) => {
              const data = Effect.runSync(res.json) as CartError;
              return new CartError(data);
            },
          ),
        );

        const json = yield* Function.pipe(
          response,
          HttpClientResponse.schemaBodyJson(schema),
        );

        return AjaxClientResponse.make({
          data: json,
        });
      }).pipe(
        Effect.catchAll((error) => {
          if (error._tag === "@brytdesigns/ajax-cart-api/CartError") {
            return Effect.succeed(
              AjaxClientResponse.make({
                error: error,
              }),
            );
          }
          return Effect.fail(error);
        }),
      );
