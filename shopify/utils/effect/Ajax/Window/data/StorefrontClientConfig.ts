import type { IStorefrontClientConfig } from "./types.js";

import * as Data from "effect/Data";

export class StorefrontClientConfig extends Data.Class<IStorefrontClientConfig> {
  constructor() {
    super({
      ...window.Shopify.storefront.config,
    });
  }
}
