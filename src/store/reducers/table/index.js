import { tableActions } from '../../actions';

const tableReducer = (state, action) => {
  switch (action.type) {
    case tableActions.SET_DATA: {
      return {
        ...state,
        data: action.data
      };
    }
    default:
      return state;
  }
};

export default tableReducer;
