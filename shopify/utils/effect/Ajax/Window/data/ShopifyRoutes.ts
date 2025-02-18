import * as Data from "effect/Data";

export interface IShopifyRoutes {
  readonly account_addresses_url: string;
  readonly account_login_url: string;
  readonly account_logout_url: string;
  readonly account_recover_url: string;
  readonly account_register_url: string;
  readonly account_url: string;
  readonly all_products_collection_url: string;
  readonly cart_add_url: string;
  readonly cart_change_url: string;
  readonly cart_clear_url: string;
  readonly cart_update_url: string;
  readonly cart_url: string;
  readonly collections_url: string;
  readonly predictive_search_url: string;
  readonly product_recommendations_url: string;
  readonly root_url: string;
  readonly search_url: string;
  readonly storefront_login_url: string;
}

export const Defaults: IShopifyRoutes = {
  account_addresses_url: "/account/addresses",
  account_login_url: "/account/login",
  account_logout_url: "/account/logout",
  account_recover_url: "/account/recover",
  account_register_url: "/account/register",
  account_url: "/account",
  all_products_collection_url: "/collections/all",
  cart_add_url: "/cart/add",
  cart_change_url: "/cart/change",
  cart_clear_url: "/cart/clear",
  cart_update_url: "/cart/update",
  cart_url: "/cart",
  collections_url: "/collections",
  predictive_search_url: "/search/suggest",
  product_recommendations_url: "/recommendations/products",
  root_url: "/",
  search_url: "/search",
  storefront_login_url:
    "/customer_authentication/login?return_to=%2Fservices%2Fliquid_rendering%2Fresource%3Ffast_storefront_renderer%3D1&locale=en",
};

export class ShopifyRoutes extends Data.Class<IShopifyRoutes> {
  constructor() {
    super({
      ...Defaults,
      ...window.Shopify.routes,
    });
  }
}

declare global {
  interface Window {
    Shopify: {
      routes: IShopifyRoutes;
    };
  }
}
