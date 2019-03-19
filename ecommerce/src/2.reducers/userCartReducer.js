import {USER_CART} from '../types'

const initialState = {userCart: 0}
export default function (state = initialState, action) {
    switch(action.type) {
        case USER_CART:
            console.log(action.payload);
            return {...state, userCart: action.payload}
        default:
        return state
    }
}