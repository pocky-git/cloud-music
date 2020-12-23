import React, { memo, useState, useRef, useEffect, useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import { Container, TopDesc, Menu } from './style'
import { getAlbumList } from './store/actionCreators'
import { isEmptyObject } from '../../utils'
import style from '../../assets/global-style'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll'
import Loading from '../../baseUI/loading'
import MusicNote from "../../baseUI/music-note"
import SongList from "../SongList"


function Album(props) {
    const [showStatus, setShowStatus] = useState(true)
    const [title, setTitle] = useState('歌单')
    const [isMarquee, setIsMarquee] = useState(false)

    const { currentAlbum:currentAlbumImmutable, enterLoading, songsCount } = props
    const { getAlbumDataDispatch } = props
    let currentAlbum = currentAlbumImmutable.toJS()

    const id = props.match.params.id 

    const handleBack = useCallback(() => {
        setShowStatus(false)
    },[])

    const headerEl = useRef()
    const HEADER_HEIGHT = 45
    const handleScroll = useCallback((pos) => {
        let minScrollY = -HEADER_HEIGHT
        let percent = Math.abs(pos.y / minScrollY)
        let headerDom = headerEl.current
        // 滑过顶部的高度开始变化
        if (pos.y < minScrollY) {
            headerDom.style.backgroundColor = style["theme-color"]
            headerDom.style.opacity = Math.min(1, (percent - 1) / 2)
            setTitle(currentAlbum.name)
            setIsMarquee(true)
        } else {
            headerDom.style.backgroundColor = ""
            headerDom.style.opacity = 1
            setTitle("歌单")
            setIsMarquee(false)
        }
    },[currentAlbum])

    const musicNoteRef = useRef ();

    const musicAnimation = (x, y) => {
        musicNoteRef.current.startAnimation ({ x, y });
    }

    useEffect(() => {
        getAlbumDataDispatch(id)
    }, [getAlbumDataDispatch,id])

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            classNames="fly"
            appear={true}
            unmountOnExit
            onExited={props.history.goBack}
        >
            <Container play={songsCount}>
                <Header ref={headerEl} title={title} isMarquee={isMarquee} handleClick={handleBack}></Header>
                {
                    !isEmptyObject(currentAlbum)?
                    <Scroll bounceTop={false} onScroll={handleScroll}>
                        <div>
                            <TopDesc background={currentAlbum.coverImgUrl}>
                                <div className="background">
                                    <div className="filter"></div>
                                </div>
                                <div className="img_wrapper">
                                    <div className="decorate"></div>
                                    <img src={currentAlbum.coverImgUrl} alt="" />
                                    <div className="play_count">
                                        <i className="iconfont play">&#xe6fc;</i>
                                        <span className="count">{Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万 </span>
                                    </div>
                                </div>
                                <div className="desc_wrapper">
                                    <div className="title">{currentAlbum.name}</div>
                                    <div className="person">
                                        <div className="avatar">
                                            <img src={currentAlbum.creator.avatarUrl} alt="" />
                                        </div>
                                        <div className="name">{currentAlbum.creator.nickname}</div>
                                    </div>
                                </div>
                            </TopDesc>
                            <Menu>
                                <div>
                                    <i className="iconfont">&#xe607;</i>
                                    评论
                                </div>
                                <div>
                                    <i className="iconfont">&#xe616;</i>
                                    点赞
                                </div>
                                <div>
                                    <i className="iconfont">&#xe6b9;</i>
                                    收藏
                                </div>
                                <div>
                                    <i className="iconfont">&#xe628;</i>
                                    更多
                                </div>
                            </Menu>

                            <SongList
                                songs={currentAlbum.tracks}
                                collectCount={currentAlbum.subscribedCount}
                                showCollect={true}
                                showBackground={true}
                                musicAnimation={musicAnimation}
                            >
                                
                            </SongList>
                        </div>
                    </Scroll>:null
                }
                <Loading show={enterLoading}/>
                <MusicNote ref={musicNoteRef}></MusicNote>
            </Container>
        </CSSTransition>
    )
}

const mapStateToProps = state => ({
    songsCount: state.getIn (['player', 'playList']).size,
    currentAlbum: state.getIn(['album', 'currentAlbum']),
    enterLoading: state.getIn(['album', 'enterLoading'])
})

const mapDispatchToProps = dispatch => ({
    getAlbumDataDispatch(id) {
        dispatch(getAlbumList(id))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(memo(Album))
