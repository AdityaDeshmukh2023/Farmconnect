// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const farmeReelApi = createApi({
  reducerPath: 'farmerReelApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/posts/' }),
  endpoints: (builder) => ({
    saveReel: builder.mutation({
      query: (candidate) => {
        return{
            url : 'addreel/',
            method : 'POST',
            body : candidate,

        }
      }
    }),

    getFarmerReel:builder.query({
      query:()=>{
        return{
          url:'viewreels/',
          method:'GET'
        }
      }
    })

  }),
})


export const { useSaveReelMutation ,useGetFarmerReelQuery} = farmeReelApi