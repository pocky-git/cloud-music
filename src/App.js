import React from 'react'
import { HashRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { Provider } from 'react-redux'

import { GlobalStyle } from './style'
import { IconFont } from './assets/iconfont'
import routes from './routes'
import store from './store'

export const App = () => {
    return (
        <Provider store={store}>
            <HashRouter>
                <GlobalStyle />
                <IconFont />
                {renderRoutes(routes)}
            </HashRouter>
        </Provider>
    )
}

export default App
