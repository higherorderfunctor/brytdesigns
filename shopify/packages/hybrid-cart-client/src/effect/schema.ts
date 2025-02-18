import * as Resource from "@repo/shopify-utils/effect/Resource";
import * as AjaxSections from "@repo/shopify-utils/effect/Ajax/Sections";
import * as Schema from "effect/Schema";

export type Attributes = Schema.Schema.Type<typeof Attributes>;

export const Attributes = Schema.Record({
  key: Schema.String,
  value: Schema.String,
});

export type DiscountApplication = Schema.Schema.Type<
  typeof DiscountApplication
>;

export const DiscountApplication = Schema.Struct({
  target_selection: Schema.Literal("all", "entitled", "explicit"),
  target_type: Schema.Literal("line_item", "shipping_line"),
  title: Schema.NonEmptyString,
  total_allocated_amount: Schema.Number,
  type: Schema.Literal("automatic", "discount_code", "manual", "script"),
  value: Schema.Number,
  value_type: Schema.Literal("fixed_amount", "percentage"),
});

export const Discount = Schema.Struct({
  amount: Schema.Number,
  title: Schema.String,
});

export type CurrencyCode = Schema.Schema.Type<typeof CurrencyCode>;
export const CurrencyCode = Schema.String;

export type Image = Schema.Schema.Type<typeof Image>;
export const Image = Schema.Struct({
  aspect_ratio: Schema.Number,
  alt: Schema.String,
  height: Schema.Number,
  url: Schema.URL,
  width: Schema.Number,
});

export type OptionWithValue = Schema.Schema.Type<typeof OptionWithValue>;
export const OptionWithValue = Schema.Struct({
  name: Schema.String,
  value: Schema.String,
});

export type QuantityRule = Schema.Schema.Type<typeof QuantityRule>;
export const QuantityRule = Schema.Struct({
  min: Schema.Number,
  max: Schema.NullOr(Schema.Number),
  increment: Schema.Number,
});

export type SellingPlanAllocationPriceAdjustment = Schema.Schema.Type<
  typeof SellingPlanAllocationPriceAdjustment
>;
export const SellingPlanAllocationPriceAdjustment = Schema.Struct({
  position: Schema.Number,
  value: Schema.Number,
});

export const SellingPlanPriceAdjustment = Schema.Struct({
  order_count: Schema.NullOr(Schema.Number),
  position: Schema.Number,
  value: Schema.Number,
  value_type: Schema.Literal("percentage", "fixed_amount", "price"),
});

export type SellingPlanOption = Schema.Schema.Type<typeof SellingPlanOption>;
export const SellingPlanOption = Schema.Struct({
  name: Schema.String,
  position: Schema.Number,
  value: Schema.String,
});

export type SellingPlan = Schema.Schema.Type<typeof SellingPlan>;
export const SellingPlan = Schema.Struct({
  id: Resource.ID,
  name: Schema.String,
  description: Schema.NullOr(Schema.String),
  options: Schema.Array(SellingPlanOption),
  recurring_deliveries: Schema.Boolean,
  fixed_selling_plan: Schema.Boolean,
  price_adjustments: Schema.Array(SellingPlanPriceAdjustment),
});

export type SellingPlanAllocation = Schema.Schema.Type<
  typeof SellingPlanAllocation
>;
export const SellingPlanAllocation = Schema.Struct({
  price_adjustments: Schema.Array(SellingPlanAllocationPriceAdjustment),
  price: Schema.Number,
  compare_at_price: Schema.Number,
  per_delivery_price: Schema.Number,
  selling_plan: SellingPlan,
});

export type LineLevelDiscountAllocation = Schema.Schema.Type<
  typeof LineLevelDiscountAllocation
>;
export const LineLevelDiscountAllocation = Schema.Struct({
  amount: Schema.Number,
  discount_application: DiscountApplication,
});

export type UnitPriceMeasurement = Schema.Schema.Type<
  typeof UnitPriceMeasurement
>;
export const UnitPriceMeasurement = Schema.Struct({
  measured_type: Schema.Literal("volume", "weight", "dimension"),
  quantity_unit: Schema.String,
  quantity_value: Schema.Number,
  reference_unit: Schema.String,
  reference_value: Schema.Number,
});

export type LineItem = Schema.Schema.Type<typeof LineItem>;
export const LineItem = Schema.Struct({
  id: Resource.ID,
  properties: Attributes,
  quantity: Schema.Number,
  variant_id: Resource.ID,
  key: Schema.String,
  title: Schema.String,
  price: Schema.Number,
  original_price: Schema.Number,
  discounted_price: Schema.Number,
  line_price: Schema.Number,
  original_line_price: Schema.Number,
  total_discount: Schema.Number,
  discounts: Schema.Array(Discount),
  sku: Schema.String,
  grams: Schema.Number,
  vendor: Schema.String,
  taxable: Schema.Boolean,
  product_id: Resource.ID,
  product_has_only_default_variant: Schema.Boolean,
  gift_card: Schema.Boolean,
  final_line_price: Schema.Number,
  final_price: Schema.Number,
  url: Schema.URL,
  featured_image: Schema.optional(Image),
  image: Schema.URL,
  handle: Schema.String,
  requires_shipping: Schema.Boolean,
  product_type: Schema.String,
  product_title: Schema.String,
  product_description: Schema.String,
  variant_title: Schema.NullOr(Schema.String),
  variant_options: Schema.Array(Schema.String),
  options_with_values: Schema.Array(OptionWithValue),
  line_level_discount_allocations: Schema.Array(LineLevelDiscountAllocation),
  line_level_total_discount: Schema.Number,
  quantity_rule: Schema.optional(QuantityRule),
  has_components: Schema.Boolean,
  unit_price: Schema.optional(Schema.Number),
  unit_price_measurement: Schema.optional(UnitPriceMeasurement),
  selling_plan_allocation: Schema.optional(SellingPlanAllocation),
});

export const Cart = Schema.Struct({
  token: Schema.String,
  note: Schema.NullOr(Schema.String),
  attributes: Attributes,
  original_total_price: Schema.Number,
  total_price: Schema.Number,
  total_discount: Schema.Number,
  total_weight: Schema.Number,
  item_count: Schema.Number,
  items: Schema.Array(LineItem),
  requires_shipping: Schema.Boolean,
  currency: CurrencyCode,
  items_subtotal_price: Schema.Number,
  cart_level_discount_applications: Schema.Array(DiscountApplication),
});

export const makeCartSchema = (sections?: string) => {
  if (sections) {
    Schema.Struct({
      ...Cart.fields,
      sections: AjaxSections.makeResponseSchema(sections),
    });
  }
  return Schema.Struct({
    ...Cart.fields,
    sections: Schema.optionalWith(Schema.Null, { default: () => null }),
  });
};

export type AddItemInput = Schema.Schema.Encoded<typeof AddItemInput>;
export const AddItemInput = Schema.Struct({
  id: Resource.ID,
  quantity: Schema.optionalWith(Schema.Number, { default: () => 1 }),
  properties: Schema.optionalWith(Attributes, { default: () => ({}) }),
  selling_plan: Schema.optional(Resource.ID),
});

export const BaseInput = Schema.extend(AjaxSections.Input);

export type CartAddInput = Schema.Schema.Encoded<typeof CartAddInput>;
export const CartAddInput = Schema.Struct({
  items: Schema.Array(AddItemInput),
}).pipe(BaseInput);

export type UpdateItemRecordInput = Schema.Schema.Encoded<
  typeof UpdateItemRecordInput
>;
export const UpdateItemRecordInput = Schema.Record({
  key: Schema.String,
  value: Schema.Number,
});

export type CartUpdateInput = Schema.Schema.Encoded<typeof CartUpdateInput>;
export const CartUpdateInput = Schema.Struct({
  updates: Schema.optional(
    Schema.Union(UpdateItemRecordInput, Schema.Array(Schema.Number)),
  ),
  note: Schema.optional(Schema.NullOr(Schema.String)),
  attributes: Schema.optional(Attributes),
}).pipe(BaseInput);

export const CartChangeItemOptionalInput = Schema.Struct({
  quantity: Schema.optional(Schema.Number),
  properties: Schema.optional(
    Schema.Record({
      key: Schema.String,
      value: Schema.NullOr(Schema.String),
    }),
  ),
  selling_plan: Schema.optional(Schema.NullOr(Resource.ID)),
}).pipe(BaseInput);

export type CartChangeInput = Schema.Schema.Encoded<typeof CartChangeInput>;
export const CartChangeInput = Schema.Union(
  Schema.extend(CartChangeItemOptionalInput)(
    Schema.Struct({
      id: Schema.String,
    }),
  ),
  Schema.extend(CartChangeItemOptionalInput)(
    Schema.Struct({
      line: Schema.Number,
    }),
  ),
);

export type CartClearInput = Schema.Schema.Encoded<typeof CartClearInput>;
export const CartClearInput = AjaxSections.Input;

export type CartGetInput = Schema.Schema.Encoded<typeof CartClearInput>;
export const CartGetInput = AjaxSections.Input;
