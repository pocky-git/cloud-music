import React, { useEffect, useState } from 'react'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'

import { SliderContainer } from './style'

function Slider(props) {
    const { bannerList } = props
    const [slideSwiper, setSlideSwiper] = useState(null)

    useEffect(() => {
        if (bannerList.length && !slideSwiper) {
            let swiper = new Swiper('.swiper-container', {
                loop: true,
                autoplay: true,
                autoplayDisableOnInteraction: false,
                pagination: { el: '.swiper-pagination' },
            })
            setSlideSwiper(swiper)
        }
    }, [bannerList.length, slideSwiper])

    return (
        <SliderContainer>
            <div className="before"></div>
            <div className="swiper-container">
                <div className="swiper-wrapper">
                    {
                        bannerList.map((item, index) => (
                            <div key={index} className="swiper-slide">
                                <div className="slider-nav">
                                    <img src={item.imageUrl} width="100%" height="100%" alt="" />
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="swiper-pagination"></div>
            </div>
        </SliderContainer>
    )
}

export default React.memo(Slider)
