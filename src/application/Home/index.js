import React from 'react'
import { renderRoutes } from 'react-router-config'
import {NavLink} from 'react-router-dom'

import { Top,Tab,TabItem } from './style'
import Player from '../Player'

export default function Home(props) {
    const {route} = props

    return (
        <div>
            <Top>
                <span className="iconfont">&#xe648;</span>
                <span className="title">云音悦</span>
                <span className="iconfont" onClick={() => props.history.push ('/search')}>&#xe61a;</span>
            </Top>
            <Tab>
                <NavLink to="/recommend" activeClassName="selected"><TabItem><span > 推荐 </span></TabItem></NavLink>
                <NavLink to="/singers" activeClassName="selected"><TabItem><span > 歌手 </span></TabItem></NavLink>
                <NavLink to="/rank" activeClassName="selected"><TabItem><span > 排行榜 </span></TabItem></NavLink>
            </Tab>
            <Player/>
            {renderRoutes(route.routes)}
        </div>
    )
}
