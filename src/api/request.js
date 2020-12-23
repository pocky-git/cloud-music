import {axiosInstance} from './config'

export const getBannerRequest = () => axiosInstance.get('/banner')

export const getRecommendListRequest = () => axiosInstance.get('/personalized')

export const getHotSingerListRequest = count => axiosInstance.get(`/top/artists?offset=${count}`)

export const getSingerListRequest= (category, alpha, count) => axiosInstance.get(`/artist/list?type=${category}&initial=${alpha.toLowerCase()}&offset=${count}`)

export const getRankListRequest = () => axiosInstance.get(`/toplist/detail`)

export const getAlbumDetailRequest = id => axiosInstance.get(`/playlist/detail?id=${id}`)

export const getSingerInfoRequest = id => axiosInstance.get (`/artists?id=${id}`)

export const getLyricRequest = id => axiosInstance.get(`/lyric?id=${id}`)

export const getHotKeyWordsRequest = () => axiosInstance.get (`/search/hot`)
  
export const getSuggestListRequest = query => axiosInstance.get (`/search/suggest?keywords=${query}`)
  
export const getResultSongsListRequest = query => axiosInstance.get (`/search?keywords=${query}`)

export const getSongDetailRequest = id => axiosInstance.get (`/song/detail?ids=${id}`)