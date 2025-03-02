import * as Logging from "@repo/shopify-utils/effect/Logging";

export const withNamespacedLogSpan = Logging.makeNamespacedLogSpan(
  "[@brytdesigns/shopify-hybrid-cart-client]",
);

export const filterLevelOrNever = Logging.filterLevelOrNever;
