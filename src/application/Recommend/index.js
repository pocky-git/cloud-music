import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { forceCheck } from 'react-lazyload'
import { renderRoutes } from 'react-router-config'

import Slider from '../../components/Slider'
import List from '../../components/List'
import Scroll from '../../baseUI/scroll'
import { Content } from './style'
import * as actionCreators from './store/actionCreators'
import Loading from '../../baseUI/loading'

function Recommend(props) {
    const { bannerList, recommendList, enterLoading, songsCount } = props
    const { getBannerDataDispatch, getRecommendListDataDispatch } = props

    useEffect(() => {
        // 如果页面有数据，则不发请求
        if (!bannerList.size) {
            getBannerDataDispatch()
        }
        if (!recommendList.size) {
            getRecommendListDataDispatch()
        }
    }, [])

    const bannerListJS = bannerList ? bannerList.toJS() : []
    const recommendListJS = recommendList ? recommendList.toJS() : []

    return (
        <Content play={songsCount}>
            <Loading show={enterLoading}/>
            <Scroll className="list" onScroll={forceCheck}>
                <div>
                    <Slider bannerList={bannerListJS} />
                    <List recommendList={recommendListJS} />
                </div>
            </Scroll>
            {renderRoutes(props.route.routes)}
        </Content>
    )
}

const mapStateTopProps = state => ({
    songsCount: state.getIn (['player', 'playList']).size,
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn(['recommend', 'recommendList']),
    enterLoading: state.getIn(['recommend', 'enterLoading'])
})

const mapDispatchToProps = dispatch => ({
    getBannerDataDispatch() {
        dispatch(actionCreators.getBannerList())
    },
    getRecommendListDataDispatch() {
        dispatch(actionCreators.getRecommendList())
    }
})

export default connect(mapStateTopProps, mapDispatchToProps)(React.memo(Recommend))