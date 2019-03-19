const INITIAL_STATE = {cart : 0}

export default (state = INITIAL_STATE, action) => {
    if (action.type === 'COUNT_CART') {
        return {...INITIAL_STATE, cart : action.payload}
    } else {
        return state
    }
}