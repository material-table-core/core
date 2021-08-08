import { coreActions } from '../../actions';

export default function tableReducer(state, action) {
  switch (action.type) {
    case coreActions.SET_DATA: {
      return {
        ...state,
        data: action.value
      };
    }
    default:
      return state;
  }
}
