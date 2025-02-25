import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const farmerPostApi = createApi({
  reducerPath: 'farmerPostApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/user/' }),
  endpoints: (builder) => ({
    savePost: builder.mutation({
      query: ({post,access_token}) => {
        return{
            url : 'posts/',
            method : 'POST',
            body : post,
            headers:{
                'authorization': `Bearer ${access_token}`,
             }

        }
      }
    }),

    getFarmerPost:builder.query({
      query:(access_token)=>{
        return{
          url:'posts/',
          method:'GET',
          headers:{
            'authorization': `Bearer ${access_token}`,
         }
        }
      }
    }),



    likeFarmerPost:builder.mutation({
      query:({uid,access_token})=>{
        return{
          url :`posts/${uid}/like/`,
          method:'POST',
          headers:{
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),
    DislikeFarmerPost:builder.mutation({
      query:({uid,access_token})=>{
        return{
          url :`posts/${uid}/dislike/`,
          method:'POST',
          headers:{
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),


    getFarmerFollowing:builder.query({
      query:(access_token)=>{
        return{
          url : 'following/',
          method : 'GET',
          headers:{
            'authorization': `Bearer ${access_token}`,
          }

        }
      }
    })

  }),
})


export const {useGetFarmerPostQuery,useSavePostMutation,useLikeFarmerPostMutation,useGetFarmerFollowingQuery,useDislikeFarmerPostMutation} = farmerPostApi