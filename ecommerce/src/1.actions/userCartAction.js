import { USER_CART } from "../types";

export const setUserCart = (cart) => {
    return {
        type: USER_CART, payload: cart
    }
}

export const countcart = (param) => {
    return {
        type : "COUNT_CART", 
        payload : param
    }
}