import React from 'react'
import LazyLoad from 'react-lazyload'
import { withRouter } from 'react-router-dom'

import { getCount } from '../../utils'
import {
    ListWrapper,
    ListItem,
    List
} from './style'

function RecommendList(props) {
    const enterDetail = id => {
        props.history.push('/recommend/' + id)
    }

    return (
        <ListWrapper>
            <h1 className="title"> 推荐歌单</h1>
            <List>
                {
                    props.recommendList.map((item, index) => (
                        <ListItem key={item.id + index} onClick={() => enterDetail(item.id)}>
                            <div className="img_wrapper">
                                <div className="decorate"></div>
                                <LazyLoad placeholder={<img width="100%" height="100%" src="http://114.215.179.76:4000/avantar/1606112761158.jpg" />}>
                                    <img src={item.picUrl + "?param=300x300"} width="100%" height="100%" alt="music" />
                                </LazyLoad>
                                <div className="play_count">
                                    <i className="iconfont play">&#xe885;</i>
                                    <span className="count">{getCount(item.playCount)}</span>
                                </div>
                            </div>
                            <div className="desc">{item.name}</div>
                        </ListItem>
                    ))
                }
            </List>
        </ListWrapper>
    )
}

export default React.memo(withRouter(RecommendList))
