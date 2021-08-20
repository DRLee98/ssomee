import axios from "axios";
import { OrderType } from "../types";

const api = axios.create({
  baseURL: "https://mock-api.ssomee.com",
});

interface getAllProductsProp {
  page?: number;
  order: OrderType;
}

interface getCategoryProductsProp extends getAllProductsProp {
  categoryId: string;
}

export interface Prefix {
  prefix: string;
}

const ssomeeApi = {
  getCategories: () => api.get("/categories"),
  getAllProducts: ({ page = 1, order }: getAllProductsProp) =>
    api.get(`/products/all/${page}`, {
      params: { order },
    }),
  getCategoryProducts: ({
    page = 1,
    order,
    categoryId,
  }: getCategoryProductsProp) =>
    api.get(`/products/${categoryId}/${page}`, {
      params: { order },
    }),
  getProductDetail: ({ prefix }: Prefix) => api.get(`/products/${prefix}`),
  postBuyProduct: ({ prefix }: Prefix) => api.post(`/products/${prefix}`),
};

export default ssomeeApi;
