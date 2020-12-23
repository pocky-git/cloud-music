import { createGlobalStyle } from 'styled-components'

export const IconFont = createGlobalStyle`
@font-face {
  font-family: 'iconfont';  /* project id 2244661 */
  src: url('https://at.alicdn.com/t/font_2244661_vymuumjci7.eot');
  src: url('https://at.alicdn.com/t/font_2244661_vymuumjci7.eot?#iefix') format('embedded-opentype'),
  url('https://at.alicdn.com/t/font_2244661_vymuumjci7.woff2') format('woff2'),
  url('https://at.alicdn.com/t/font_2244661_vymuumjci7.woff') format('woff'),
  url('https://at.alicdn.com/t/font_2244661_vymuumjci7.ttf') format('truetype'),
  url('https://at.alicdn.com/t/font_2244661_vymuumjci7.svg#iconfont') format('svg');
}

    .iconfont {
      font-family: "iconfont" !important;
      font-size: 16px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
`