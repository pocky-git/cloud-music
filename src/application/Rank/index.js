import React, { memo, useEffect } from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'

import {
    getRankList
} from './store/actionCreators'
import { filterIndex } from '../../utils'
import { Container, List, ListItem, SongList } from './style'
import Scroll from '../../baseUI/scroll'
import Loading from '../../baseUI/loading'

function Rank(props) {
    const { rankList: list, loading, songsCount } = props
    const { getRankListDataDispatch } = props

    const rankList = list ? list.toJS() : []
    let globalStartIndex = filterIndex(rankList)
    let officialList = rankList.slice(0, globalStartIndex)
    let globalList = rankList.slice(globalStartIndex)

    const enterDetail = id => {
        props.history.push('/rank/' + id)
    }

    useEffect(() => {
        if (!rankList.size) {
            getRankListDataDispatch()
        }
    }, [])

    const renderRankList = (list, global) => {
        return (
            <List globalRank={global}>
                {
                    list.map((item) => {
                        return (
                            <ListItem key={item.id} tracks={item.tracks} onClick={() => enterDetail(item.id)}>
                                <div className="img_wrapper">
                                    <img src={item.coverImgUrl} alt="" />
                                    <div className="decorate"></div>
                                    <span className="update_frequecy">{item.updateFrequency}</span>
                                </div>
                                {renderSongList(item.tracks)}
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }

    const renderSongList = (list) => {
        return list.length ? (
            <SongList>
                {
                    list.map((item, index) => {
                        return <li key={index}>{index + 1}. {item.first} - {item.second}</li>
                    })
                }
            </SongList>
        ) : null
    }

    // 榜单数据未加载出来之前都给隐藏
    let displayStyle = loading ? { "display": "none" } : { "display": "" };

    return (
        <Container play={songsCount}>
            <Scroll>
                <div>
                    <h1 className="offical" style={displayStyle}> 官方榜 </h1>
                    {renderRankList(officialList)}
                    <h1 className="global" style={displayStyle}> 全球榜 </h1>
                    {renderRankList(globalList, true)}
                    {<Loading show={loading}></Loading>}
                </div>
            </Scroll>
            {renderRoutes(props.route.routes)}
        </Container>
    )
}

const mapStateToProps = state => ({
    songsCount: state.getIn (['player', 'playList']).size,
    rankList: state.getIn(['rank', 'rankList']),
    loading: state.getIn(['rank', 'loading'])
})

const mapDispatchToProps = dispatch => ({
    getRankListDataDispatch() {
        dispatch(getRankList())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(memo(Rank))