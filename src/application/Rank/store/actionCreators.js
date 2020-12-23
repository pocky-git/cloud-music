import { fromJS } from 'immutable'

import { getRankListRequest } from '../../../api/request'
import { CHANGE_RANK_LIST, CHANGE_LOADING } from './constants'

const changeRankList = data => ({
    type: CHANGE_RANK_LIST,
    data: fromJS(data)
})

const changeLoading = data => ({
    type: CHANGE_LOADING,
    data
})

export const getRankList = () => {
    return dispatch => {
        getRankListRequest().then(data => {
            let list = data && data.list
            dispatch(changeLoading(false))
            dispatch(changeRankList(list))
        }).catch(()=>{
            console.log('获取排行榜列表失败')
        })
    }
}