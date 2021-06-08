const tableReducer = (state, action) => {
  switch (action.type) {
    // ~ FOR DEMO PURPOSES ~
    //    case "setVal":
    //        return { ...state, count: action.val };
    //    case "increment":
    //        return { ...state, count: state.count + 1 };
    //    case "decrement":
    //        return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

export default tableReducer;
