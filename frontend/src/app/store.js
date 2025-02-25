import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userAuthApi } from '../services/userAuthApi'
import authSlicer from '../features/authSlice'
import userInfoSlice from '../features/userSlice'
import {farmeReelApi } from '../services/farmerReelApi'
import { farmerProfileApi } from '../services/farmerProfileApi'
import { farmerPostApi } from '../services/farmerPostApi'
export const store = configureStore({
  reducer: {
    [userAuthApi.reducerPath]: userAuthApi.reducer,
    auth_token: authSlicer,
    user_info: userInfoSlice,
    [farmeReelApi.reducerPath]: farmeReelApi.reducer,
    [farmerProfileApi.reducerPath]: farmerProfileApi.reducer,
    [farmerPostApi.reducerPath] : farmerPostApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAuthApi.middleware, farmeReelApi.middleware,farmerProfileApi.middleware,farmerPostApi.middleware),
})





setupListeners(store.dispatch)