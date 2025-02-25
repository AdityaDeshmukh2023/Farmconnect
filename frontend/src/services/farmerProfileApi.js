import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const farmerProfileApi = createApi({
  reducerPath: 'farmerProfileApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/user/' }),
  endpoints: (builder) => ({
    saveProfile: builder.mutation({
      query: ({farmer,access_token}) => {
        return{
            url : 'profile-input/',
            method : 'POST',
            body : farmer,
            headers:{
                'authorization': `Bearer ${access_token}`,
             }

        }
      }
    }),

    getFarmerProfile:builder.query({
      query:(access_token)=>{
        return{
          url:'profile/',
          method:'GET',
          headers:{
            'authorization': `Bearer ${access_token}`,
         }
        }
      }
    }),

    followFarmerProfile:builder.mutation({
      query:({user,access_token})=>{
        return{
          url : `follow/${user}/`,
          method : 'POST',
          headers:{
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    })

  }),
})


export const {useSaveProfileMutation  ,useGetFarmerProfileQuery , useFollowFarmerProfileMutation} = farmerProfileApi