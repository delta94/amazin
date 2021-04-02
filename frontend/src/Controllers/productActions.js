import Axios from "axios";
import {
  currencyTypeActions,
  productListAllActions,
  productListActions,
  productCategoryListActions,
  productDetailsActions,
  productCreateActions,
  productUpdateActions,
  productDeleteActions,
  productReviewCreateActions,
} from "../Features/Product/ProductSlice";
import { pipe } from "../utils";

export const setSessionCurrency = (currencyType) => (dispatch) => {
  dispatch(currencyTypeActions._CHANGE(currencyType));
};

export const updateCurrencyRates = () => async (dispatch) => {
  dispatch(currencyTypeActions._REQUEST());
  try {
    const {
      data,
    } = await Axios.get(
      `http://api.exchangeratesapi.io/v1/latest?access_key=${process.env.REACT_APP_RATES_API_KEY}`,
      { mode: "cors" }
    );
    dispatch(currencyTypeActions._SUCCESS(data));
    pipe.currencies.map(
      (c) => (pipe.rates[c] = data.rates[c] || pipe.rates[c])
    );
  } catch (error) {
    dispatch(currencyTypeActions._FAIL(error.message));
  }
};

export const listAllProducts = ({ pageSize = 6, category = "" }) => async (
  dispatch
) => {
  dispatch(productListAllActions._REQUEST());
  try {
    const {
      data,
    } = await Axios.get(`/api/products?pageSize=999&category=${category}`, {
      mode: "cors",
    });
    dispatch(productListAllActions._SUCCESS(data));
  } catch (error) {
    dispatch(productListAllActions._FAIL(error.message));
  }
};

export const listProducts = ({
  pageSize = 6,
  pageNumber = "",
  seller = "",
  name = "",
  category = "",
  order = "",
  deal = 0,
  min = 0,
  max = 0,
  rating = 0,
}) => async (dispatch) => {
  dispatch(productListActions._REQUEST());
  try {
    const {
      data,
    } = await Axios.get(
      `/api/products?pageSize=${pageSize}&pageNumber=${pageNumber}&seller=${seller}&name=${name}&category=${category}&deal=${deal}&min=${min}&max=${max}&rating=${rating}&order=${order}`,
      { mode: "cors" }
    );
    dispatch(productListActions._SUCCESS(data));
  } catch (error) {
    dispatch(productListActions._FAIL(error.message));
  }
};

export const listProductCategories = () => async (dispatch) => {
  dispatch(productCategoryListActions._REQUEST());
  try {
    const { data } = await Axios.get(`/api/products/categories`, {
      mode: "cors",
    });
    dispatch(productCategoryListActions._SUCCESS(data));
  } catch (error) {
    dispatch(productCategoryListActions._FAIL(error.message));
  }
};

export const detailsProduct = (productId) => async (dispatch) => {
  dispatch(productDetailsActions._REQUEST(productId));
  try {
    const { data } = await Axios.get(`/api/products/${productId}`, {
      mode: "cors",
    });
    dispatch(productDetailsActions._SUCCESS(data));
  } catch (error) {
    dispatch(
      productDetailsActions._FAIL(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const createProduct = () => async (dispatch, getState) => {
  dispatch(productCreateActions._REQUEST());
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.post(
      "/api/products",
      {},
      { mode: "cors", headers: { Authorization: `Bearer ${userInfo.token}` } }
    );
    dispatch(productCreateActions._SUCCESS(data.product));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(productCreateActions._FAIL(message));
  }
};
export const updateProduct = (product) => async (dispatch, getState) => {
  dispatch(productUpdateActions._REQUEST(product));
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/products/${product._id}`, product, {
      mode: "cors",
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch(productUpdateActions._SUCCESS(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(productUpdateActions._FAIL(message));
  }
};
export const deleteProduct = (productId) => async (dispatch, getState) => {
  dispatch(productDeleteActions._REQUEST(productId));
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    Axios.delete(`/api/products/${productId}`, {
      mode: "cors",
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch(productDeleteActions._SUCCESS());
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(productDeleteActions._FAIL(message));
  }
};
export const createReview = (productId, review) => async (
  dispatch,
  getState
) => {
  dispatch(productReviewCreateActions._REQUEST());
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.post(
      `/api/products/${productId}/reviews`,
      review,
      { mode: "cors", headers: { Authorization: `Bearer ${userInfo.token}` } }
    );
    dispatch(productReviewCreateActions._SUCCESS(data.review));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(productReviewCreateActions._FAIL(message));
  }
};
