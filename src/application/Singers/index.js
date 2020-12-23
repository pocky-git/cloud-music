import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import LazyLoad, { forceCheck } from 'react-lazyload'
import { renderRoutes } from 'react-router-config'

import Horizen from '../../baseUI/horizen-item'
import { categoryTypes, alphaTypes } from '../../api/config'
import { NavContainer, ListContainer, List, ListItem } from './style'
import Scroll from '../../baseUI/scroll'
import {
    getSingerList,
    getHotSingerList,
    changeEnterLoading,
    changePageCount,
    refreshMoreSingerList,
    changePullUpLoading,
    changePullDownLoading,
    refreshMoreHotSingerList
} from './store/actionCreators'
import Loading from '../../baseUI/loading'

function Singers(props) {
    const [category, setCategory] = useState('')
    const [alpha, setAlpha] = useState('')

    const { singerList, pageCount, pullUpLoading, pullDownLoading, enterLoading, songsCount } = props
    const { getHotSingerDispatch, updateDispatch, pullUpRefreshDispatch, pullDownRefreshDispatch } = props

    const handleUpdateCategory = val => {
        setCategory(val)
        updateDispatch(val, alpha)
    }

    const handleUpdateAlpha = val => {
        setAlpha(val)
        updateDispatch(category, val)
    }

    const handlePullUp = () => {
        pullUpRefreshDispatch(category, alpha, category === '', pageCount)
    }

    const handlePullDown = () => {
        pullDownRefreshDispatch(category, alpha)
    }

    const enterDetail = id => {
        props.history.push('/singers/'+id)
    }

    useEffect(() => {
        if (!singerList.size) {
            getHotSingerDispatch()
        }
    }, [])

    const renderSingerList = () => {
        const list = singerList ? singerList.toJS() : []
        return (
            <List>
                {
                    list.map((item, index) => {
                        return (
                            <ListItem key={item.accountId + "" + index} onClick={()=>enterDetail(item.id)}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src="http://114.215.179.76:4000/avantar/1606112761158.jpg" />} alt="music">
                                        <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                </div>
                                <span className="name">{item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }

    return (
        <div>
            <NavContainer>
                <Horizen
                    list={categoryTypes}
                    title={"分类 (默认热门) :"}
                    handleClick={handleUpdateCategory}
                    oldVal={category}
                />
                <Horizen
                    list={alphaTypes}
                    title={"首字母 :"}
                    handleClick={handleUpdateAlpha}
                    oldVal={alpha}
                />
            </NavContainer>
            <ListContainer play={songsCount}>
                <Loading show={enterLoading}></Loading>
                <Scroll
                    onScroll={forceCheck}
                    pullUp={handlePullUp}
                    pullDown={handlePullDown}
                    pullUpLoading={pullUpLoading}
                    pullDownLoading={pullDownLoading}
                >
                    {renderSingerList()}
                </Scroll>
            </ListContainer>
            {renderRoutes(props.route.routes)}
        </div>
    )
}

const mapStateToProps = state => ({
    songsCount: state.getIn (['player', 'playList']).size,
    singerList: state.getIn(['singers', 'singerList']),
    enterLoading: state.getIn(['singers', 'enterLoading']),
    pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
    pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
    pageCount: state.getIn(['singers', 'pageCount'])
})

const mapDispatchToProps = dispatch => ({
    getHotSingerDispatch() {
        dispatch(getHotSingerList())
    },
    updateDispatch(category, alpha) {
        dispatch(changePageCount(0))
        dispatch(changeEnterLoading(true))
        dispatch(getSingerList(category, alpha))
    },
    // 滑到最底部刷新部分的处理
    pullUpRefreshDispatch(category, alpha, hot, count) {
        dispatch(changePullUpLoading(true))
        dispatch(changePageCount(count + 1))
        if (hot) {
            dispatch(refreshMoreHotSingerList())
        } else {
            dispatch(refreshMoreSingerList(category, alpha))
        }
    },
    // 顶部下拉刷新
    pullDownRefreshDispatch(category, alpha) {
        dispatch(changePullDownLoading(true))
        dispatch(changePageCount(0))
        if (category === '' && alpha === '') {
            dispatch(getHotSingerList())
        } else {
            dispatch(getSingerList(category, alpha))
        }
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers))