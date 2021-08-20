export enum OrderType {
  PriceAsc = "price-asc",
  PriceDesc = "price-desc",
  DateDesc = "date-desc",
}

export interface CategoryType {
  id?: number;
  name: string;
}

export interface BrandType {
  id?: number;
  name: string;
}

export interface ShopType {
  id: number;
  name: string;
}

export interface ProductType {
  brand: BrandType;
  mainImage: string;
  name: string;
  originalPrice: number;
  prefix: string;
  productUrl?: string;
  soldOut: boolean;
  ssomeePrice: number;
}

export interface OptionItemType {
  id: number;
  name: string;
  price: number;
}

export interface OptionType {
  id: number;
  optionCategoryName: string;
  options: OptionItemType[];
  type: string;
}

export interface ProductDetailType extends ProductType {
  category: CategoryType;
  charges: number[];
  commissionRate: number;
  createdAt: string;
  currentOrderLimit: number;
  description: string;
  detailImages: { index: number; image: string }[];
  orderLimit: number;
  shippingPrice: number;
  shop: ShopType;
  options: OptionType[];
  updatedAt: string;
}

export interface SelectedOptionType {
  optionName: string;
  optionValue?: { name: string; price?: number };
}

export interface BuyProductDetailType extends ProductDetailType {
  selectedOptions: SelectedOptionType[];
}

export interface ProductsListType {
  category: CategoryType;
  maxPage: number;
  productCount: number;
  products: ProductType[];
}
