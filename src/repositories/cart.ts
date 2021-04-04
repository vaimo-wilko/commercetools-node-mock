import { Cart, CartDraft, ReferenceTypeId } from '@commercetools/platform-sdk';
import AbstractRepository from './abstract';

export class CartRepository extends AbstractRepository {
  getTypeId(): ReferenceTypeId {
    return 'cart';
  }

  create(draft: CartDraft): Cart {
    const resource: Cart = {
      ...this.getResourceProperties(),
      cartState: 'Active',
      lineItems: [],
      customLineItems: [],
      totalPrice: {
        type: 'centPrecision',
        centAmount: 0,
        currencyCode: draft.currency,
        fractionDigits: 0,
      },
      taxMode: 'Platform',
      taxRoundingMode: 'HalfEven',
      taxCalculationMode: 'LineItemLevel',
      refusedGifts: [],
      origin: 'Customer',
    };
    this.save(resource);
    return resource;
  }
}
