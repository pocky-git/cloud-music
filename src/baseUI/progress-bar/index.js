import React, { memo, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import style from '../../assets/global-style'
import { prefixStyle } from './../../utils'

const ProgressBarWrapper = styled.div`
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, .3);
    .progress {
      position: absolute;
      height: 100%;
      background: ${style["theme-color"]};
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -15px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid ${style["border-color"]};
        border-radius: 50%;
        background: ${style["theme-color"]};
      }
    }
  }
`

function ProgressBar(props) {
  const progressBar = useRef()
  const progress = useRef()
  const progressBtn = useRef()

  const [touch, setTouch] = useState({})

  const { percent } = props
  const { percentChange } = props

  const transform = prefixStyle('transform')

  useEffect(() => {
    if (percent >= 0 && percent <= 1 && !touch.initiated) {
      const barWidth = progressBar.current.clientWidth
      const offsetWidth = percent * barWidth
      progress.current.style.width = `${offsetWidth}px`
      progressBtn.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  }, [percent])

  const _changePercent = () => {
    const barWidth = progressBar.current.clientWidth
    const curPercent = progress.current.clientWidth / barWidth
    percentChange(curPercent)
  }

  const _offset = offsetWidth => {
    progress.current.style.width = `${offsetWidth}px`
    progressBtn.current.style[transform] = `translate3d(${offsetWidth}px,0,0)`
  }

  const progressTouchStart = e => {
    const startX = e.touches[0].pageX
    touch.initial = true
    touch.startX = startX
    touch.left = progress.current.clientWidth
    setTouch(touch)
  }

  const progressTouchMove = e => {
    if (!touch.initial) return
    const offsetWidth = Math.min(Math.max(0, touch.left + (e.touches[0].pageX - touch.startX)), progressBar.current.clientWidth)
    _offset(offsetWidth)
    _changePercent(offsetWidth)
  }

  const progressTouchEnd = () => {
    touch.initial = false
    setTouch(touch)
  }

  const progressClick = e => {
    const offsetWidth = Math.min(Math.max(0, e.pageX - progressBar.current.getBoundingClientRect().x), progressBar.current.clientWidth)
    _offset(offsetWidth)
    _changePercent(offsetWidth)
  }

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar} onClick={progressClick}>
        <div className="progress" ref={progress}></div>
        <div
          className="progress-btn-wrapper"
          ref={progressBtn}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarWrapper>
  )
}

export default memo(ProgressBar)
