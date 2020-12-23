import React, { memo, useRef, useState, useEffect } from "react"
import { connect } from "react-redux"
import {
    changePlayingState,
    changeShowPlayList,
    changeCurrentIndex,
    changeCurrentSong,
    changePlayList,
    changePlayMode,
    changeFullScreen
} from "./store/actionCreators"

import MiniPlayer from './miniPlayer'
import NormalPlayer from './normalPlayer'
import PlayList from './playList'
import { getSongUrl, isEmptyObject, shuffle, findIndex } from '../../utils'
import { playMode } from '../../api/config'
import { getLyricRequest } from '../../api/request'
import Lyric from '../../api/lyric-parser'

function Player(props) {
    const {
        playing,
        currentSong: immutableCurrentSong,
        currentIndex,
        playList: immutablePlayList,
        mode,
        sequencePlayList: immutableSequencePlayList,
        fullScreen
    } = props

    const {
        togglePlayingDispatch,
        togglePlayListDispatch,
        changeCurrentIndexDispatch,
        changeCurrentDispatch,
        changePlayListDispatch,
        changeModeDispatch,
        toggleFullScreenDispatch
    } = props

    const playList = immutablePlayList.toJS()
    const sequencePlayList = immutableSequencePlayList.toJS()
    const currentSong = immutableCurrentSong.toJS()

    //目前播放时间
    const [currentTime, setCurrentTime] = useState(0)
    //歌曲总时长
    const [duration, setDuration] = useState(0)
    //歌曲总时长
    const [preSong, setPreSong] = useState({})
    //歌曲播放进度
    let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration
    const [currentPlayingLyric, setPlayingLyric] = useState("")

    const audioRef = useRef()
    const songReady = useRef(true)
    const currentLyric = useRef()
    const currentLineNum = useRef(0)

    //控制播放暂停
    const clickPlaying = (e, state) => {
        e.stopPropagation()
        togglePlayingDispatch(state)
        if (currentLyric.current) {
            currentLyric.current.togglePlay(currentTime * 1000);
        }
    }

    //获取当前播放进度
    const updateTime = e => {
        setCurrentTime(e.target.currentTime)
    }

    //改变播放进度
    const onProgressChange = curPercent => {
        const newTime = curPercent * duration
        setCurrentTime(newTime)
        audioRef.current.currentTime = newTime
        if (!playing) {
            togglePlayingDispatch(true)
        }
        if (currentLyric.current) {
            currentLyric.current.seek(newTime * 1000);
        }
    }

    //一首歌循环
    const handleLoop = () => {
        audioRef.current.currentTime = 0
        changePlayingState(true)
        audioRef.current.play()
    }

    //播放上一首
    const handlePrev = () => {
        //播放列表只有一首歌时单曲循环
        if (playList.length === 1) {
            handleLoop()
            return
        }
        let index = currentIndex - 1
        if (index < 0) index = playList.length - 1
        if (!playing) togglePlayingDispatch(true)
        changeCurrentIndexDispatch(index)
    }

    //播放下一首
    const handleNext = () => {
        //播放列表只有一首歌时单曲循环
        if (playList.length === 1) {
            handleLoop()
            return
        }
        let index = currentIndex + 1
        if (index === playList.length) index = 0
        if (!playing) togglePlayingDispatch(true)
        changeCurrentIndexDispatch(index)
    }

    //选择播放模式
    const changeMode = () => {
        let newMode = (mode + 1) % 3
        if (newMode === 0) {
            //顺序模式
            changePlayListDispatch(sequencePlayList)
            let index = findIndex(currentSong, sequencePlayList)
            changeCurrentIndexDispatch(index)
        } else if (newMode === 1) {
            //单曲循环
            changePlayListDispatch(sequencePlayList)
        } else if (newMode === 2) {
            //随机播放
            let newList = shuffle(sequencePlayList)
            let index = findIndex(currentSong, newList)
            changePlayListDispatch(newList)
            changeCurrentIndexDispatch(index)
        }
        changeModeDispatch(newMode)
    }

    const handleEnd = () => {
        if (mode === playMode.loop) {
            handleLoop()
        } else {
            handleNext()
        }
    }

    const handleError = () => {
        songReady.current = true;
        alert("播放出错");
    }

    const handleLyric = ({ lineNum, txt }) => {
        if (!currentLyric.current) return
        currentLineNum.current = lineNum
        setPlayingLyric(txt)
    }

    const getLyric = id => {
        let lyric = ""
        if (currentLyric.current) {
            currentLyric.current.stop()
        }
        getLyricRequest(id)
            .then(data => {
                lyric = data.lrc.lyric
                if (!lyric) {
                    currentLyric.current = null
                    return
                }
                currentLyric.current = new Lyric(lyric, handleLyric)
                currentLyric.current.play()
                currentLineNum.current = 0
                currentLyric.current.seek(0)
            })
            .catch(() => {
                songReady.current = true
                audioRef.current.play()
            })
    }

    useEffect(() => {
        if (
            !playList.length ||
            currentIndex === -1 ||
            !playList[currentIndex] ||
            playList[currentIndex].id === preSong.id ||
            !songReady.current
        )
            return
        let current = playList[currentIndex]
        changeCurrentDispatch(current)
        setPreSong(current)
        songReady.current = false
        audioRef.current.src = getSongUrl(current.id)
        setTimeout(() => {
            audioRef.current.play().then(() => {
                songReady.current = true
            })
        })
        togglePlayingDispatch(true)

        getLyric(current.id)
        setCurrentTime(0)
        setDuration((current.dt / 1000) | 0)
    }, [playList, currentIndex])

    useEffect(() => {
        playing ? audioRef.current.play() : audioRef.current.pause()
    }, [playing])

    return (
        <div>
            {
                !isEmptyObject(currentSong) ?
                    <MiniPlayer
                        song={currentSong}
                        playing={playing}
                        fullScreen={fullScreen}
                        toggleFullScreen={toggleFullScreenDispatch}
                        clickPlaying={clickPlaying}
                        percent={percent}
                        togglePlayList={togglePlayListDispatch}
                    /> : null
            }
            {
                !isEmptyObject(currentSong) ?
                    <NormalPlayer
                        song={currentSong}
                        playing={playing}
                        fullScreen={fullScreen}
                        toggleFullScreen={toggleFullScreenDispatch}
                        clickPlaying={clickPlaying}
                        duration={duration}
                        currentTime={currentTime}
                        percent={percent}
                        onProgressChange={onProgressChange}
                        handlePrev={handlePrev}
                        handleNext={handleNext}
                        mode={mode}
                        changeMode={changeMode}
                        togglePlayList={togglePlayListDispatch}
                        currentLyric={currentLyric.current}
                        currentPlayingLyric={currentPlayingLyric}
                        currentLineNum={currentLineNum.current}
                    /> : null
            }
            <PlayList />
            <audio
                ref={audioRef}
                onTimeUpdate={updateTime}
                onEnded={handleEnd}
                onError={handleError}
            />
        </div>
    )
}

const mapStateToProps = state => ({
    fullScreen: state.getIn(["player", "fullScreen"]),
    playing: state.getIn(["player", "playing"]),
    currentSong: state.getIn(["player", "currentSong"]),
    showPlayList: state.getIn(["player", "showPlayList"]),
    mode: state.getIn(["player", "mode"]),
    currentIndex: state.getIn(["player", "currentIndex"]),
    playList: state.getIn(["player", "playList"]),
    sequencePlayList: state.getIn(["player", "sequencePlayList"])
})

const mapDispatchToProps = dispatch => ({
    togglePlayingDispatch(data) {
        dispatch(changePlayingState(data))
    },
    toggleFullScreenDispatch(data) {
        dispatch(changeFullScreen(data))
    },
    togglePlayListDispatch(data) {
        dispatch(changeShowPlayList(data))
    },
    changeCurrentIndexDispatch(index) {
        dispatch(changeCurrentIndex(index))
    },
    changeCurrentDispatch(data) {
        dispatch(changeCurrentSong(data))
    },
    changeModeDispatch(data) {
        dispatch(changePlayMode(data))
    },
    changePlayListDispatch(data) {
        dispatch(changePlayList(data))
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(memo(Player))
