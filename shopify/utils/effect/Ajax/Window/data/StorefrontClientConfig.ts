import type { IStorefrontClientConfig } from "./types";

import * as Data from "effect/Data";

export class StorefrontClientConfig extends Data.Class<IStorefrontClientConfig> {
  constructor() {
    super({
      ...window.Shopify.storefront.config,
    });
  }
}
