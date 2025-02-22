import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as Function from "effect/Function";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as FetchHttpClient from "@effect/platform/FetchHttpClient";
import * as Layer from "effect/Layer";
import * as LogLevel from "effect/LogLevel";

import * as AjaxSections from "@repo/shopify-utils/effect/Ajax/Sections";
import { ShopifyRoutes } from "@repo/shopify-utils/effect";

import * as LoggerUtils from "./LoggerUtils.js";
import { CartError } from "../errors.js";
import { Cart, makeCartSchema } from "../schema.js";
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
    (input?: Schema.Schema<A, I, R>["Encoded"]) =>
      Effect.gen(function* () {
        const client = yield* HttpClient.HttpClient;
        const decodedInput = yield* Schema.decodeUnknown(inputSchema)(input);
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

        if (decodedInput.sections) {
          const json = yield* Function.pipe(
            response,
            HttpClientResponse.schemaBodyJson(
              Schema.Struct({
                ...Cart.fields,
                sections: AjaxSections.makeResponseSchema(decodedInput.sections),
              }),
            ),
          );
          const clientResponse = AjaxClientResponse.make({
            data: json,
          });

          yield* Effect.annotateLogsScoped({
            method,
            route,
            input: decodedInput,
            ouput: clientResponse,
          });

          return clientResponse;
        }

        const json = yield* Function.pipe(
          response,
          HttpClientResponse.schemaBodyJson(
            Schema.Struct({
              ...Cart.fields,
              sections: Schema.optionalWith(Schema.Null, { default: () => null }),
            }),
          ),
        );

        const clientResponse = AjaxClientResponse.make({
          data: json,
        });

        yield* Effect.annotateLogsScoped({
          method,
          route,
          input: decodedInput,
          output: clientResponse,
        });

        return clientResponse;
      }).pipe(
        Effect.provide(LoggerUtils.Default),
        Effect.catchAll((error) => {
          if (error._tag === "@brytdesigns/hybrid-cart-client/CartError") {
            return Effect.succeed(
              AjaxClientResponse.make({
                error: error,
              }),
            );
          }
          return Effect.fail(error);
        }),
        LoggerUtils.withNamespacedLogSpan(
          routeName.replace("_url", "").replace("_", "."),
        ),
      );

export const Default = Layer.mergeAll(FetchHttpClient.layer);
