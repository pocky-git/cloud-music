import React, { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react'
import BScroll from 'better-scroll'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Loading from '../loading'
import LoadingV2 from '../loading-v2'

const ScrollContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`

const PullUpLoading = styled.div`
  position: absolute;
  left:0; right:0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`;

const PullDownLoading = styled.div`
  position: absolute;
  left:0; right:0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`;

const Scroll = forwardRef((props, ref) => {
    const {
        direction,
        click,
        refresh,
        onScroll,
        pullUpLoading,
        pullDownLoading,
        pullUp,
        pullDown,
        bounceTop,
        bounceBottom
    } = props

    const scrollContainerRef = useRef()

    const [bScroll, setBScroll] = useState(null)

    useEffect(() => {
        const scroll = new BScroll(scrollContainerRef.current, {
            scrollX: direction === 'horizental',
            scrollY: direction === 'vertical',
            click,
            probeType: 3,
            bounce: {
                top: bounceTop,
                bottom: bounceBottom
            }
        })
        setBScroll(scroll)
        return () => {
            setBScroll(null)
        }
    }, [])

    // 滑动事件
    useEffect(() => {
        if (!onScroll || !bScroll) return
        bScroll.on('scroll', scroll => {
            onScroll(scroll)
        })
        return () => {
            bScroll.off('scroll')
        }
    }, [onScroll, bScroll])

    // 下拉加载更多
    useEffect(() => {
        if (!pullUp || !bScroll) return
        bScroll.on('scrollEnd', () => {
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUp()
            }
        })
        return () => {
            bScroll.off('scrollEnd')
        }
    }, [pullUp, bScroll])

    // 上拉刷新
    useEffect(() => {
        if (!pullDown || !bScroll) return
        bScroll.on('touchEnd', pos => {
            if (pos.y > 50) {
                pullDown()
            }
        })
        return () => {
            bScroll.off('touchEnd')
        }
    }, [pullDown, bScroll])

    useEffect(() => {
        if (refresh && bScroll) {
            bScroll.refresh()
        }
    })

    useImperativeHandle(ref, () => ({
        // 给外界暴露 refresh 方法
        refresh() {
            if (bScroll) {
                bScroll.refresh();
                bScroll.scrollTo(0, 0);
            }
        },
        // 给外界暴露 getBScroll 方法，提供 bs 实例
        getBScroll() {
            if (bScroll) {
                return bScroll;
            }
        }
    }))

    const PullUpdisplayStyle = pullUpLoading ? {display: ""} : { display:"none" };
    const PullDowndisplayStyle = pullDownLoading ? { display: ""} : { display:"none" };

    return (
        <ScrollContainer ref={scrollContainerRef}>
            {props.children}
            <PullUpLoading style={ PullUpdisplayStyle }><Loading></Loading></PullUpLoading>
            <PullDownLoading style={ PullDowndisplayStyle }><LoadingV2></LoadingV2></PullDownLoading>
        </ScrollContainer>
    )
})

Scroll.propTypes = {
    direction: PropTypes.oneOf(['vertical', 'horizental']),// 滚动的方向
    click: PropTypes.bool,// 是否支持点击
    refresh: PropTypes.bool,// 是否刷新
    onScroll: PropTypes.func,// 滑动触发的回调函数
    pullUp: PropTypes.func,// 上拉加载逻辑
    pullDown: PropTypes.func,// 下拉加载逻辑
    pullUpLoading: PropTypes.bool,// 是否显示上拉 loading 动画
    pullDownLoading: PropTypes.bool,// 是否显示下拉 loading 动画
    bounceTop: PropTypes.bool,// 是否支持向上吸顶
    bounceBottom: PropTypes.bool// 是否支持向下吸底
}

Scroll.defaultProps = {
    direction: "vertical",
    click: true,
    refresh: true,
    onScroll: null,
    pullUpLoading: false,
    pullDownLoading: false,
    pullUp: null,
    pullDown: null,
    bounceTop: true,
    bounceBottom: true
}

export default Scroll
