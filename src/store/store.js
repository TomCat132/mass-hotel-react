import { createStore } from 'redux';

// 定义初始状态
const initialState = {
  selectedVoucher: null,
  location: {
    latitude: null,
    longitude: null,
    city: null,
  },
};
// 定义 action 类型
const SET_LOCATION = 'SET_LOCATION';

// 定义 action 创建函数
export const setLocation = (location) => ({
  type: SET_LOCATION,
  payload: location,
});

const reducer = (state = initialState, action) => {
  console.log("Reducer action:", action); // 调试信息
  switch (action.type) {
    case 'SET_SELECTED_VOUCHER':
      return {
        ...state,
        selectedVoucher: action.payload,
      };
    case 'SET_LOCATION':  // 添加对 SET_LOCATION 的处理
      console.log("Setting location:", action.payload); // 调试信息
      return {
        ...state,
        location: {
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
          city: action.payload.city,
        },
      };
    default:
      return state;
  }
};



// 创建 store
const store = createStore(reducer);

export default store;