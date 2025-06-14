import actionType from "../actions/actionType";

const initState = {
  userData: {},
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case actionType.GET_CURRENT_PENDING:
      return {
        ...state,
        status: 'loading',
      };
    case actionType.GET_CURRENT_FULFILLED:
      return {
        ...state,
        userData: action.currentData || {},
        status: 'succeeded',
      };
    case actionType.GET_CURRENT_REJECTED:
      return {
        ...state,
        userData: {},
        status: 'failed',
      };
    default:
      return state;
  }
};
export default userReducer;
