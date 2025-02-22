import * as Logger from "effect/Logger";
import * as Layer from "effect/Layer";
import * as Logging from "@repo/shopify-utils/effect/Logging";

export const withNamespacedLogSpan = Logging.makeNamespacedLogSpan(
  "[@brytdesigns/shopify-hybrid-cart-client]",
);

export const filterLevelOrNever = Logging.filterLevelOrNever;

export const Default = Layer.mergeAll(Logger.pretty);
