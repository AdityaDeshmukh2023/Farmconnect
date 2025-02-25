import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  email:"",
  name : "",
}

export const userInfoSlice = createSlice({
  name: 'user_info',
  initialState,
  reducers: {
    setUserInfo:(state,action)=>{
        state.email = action.payload.email
        state.name = action.payload.name
    },
    unSetUserInfo:(state)=>{
        state.email = ""
        state.name = ""
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserInfo,unSetUserInfo } = userInfoSlice.actions

export default userInfoSlice.reducer