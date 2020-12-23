import axios from 'axios'

const baseURL = 'http://114.215.179.76:5000'

const axiosInstance = axios.create({
  baseURL
})

axiosInstance.interceptors.response.use(
  res => res.data,
  err => {
    console.log(err, '网络错误')
  }
)

export {
  axiosInstance
}

// 歌手种类
export const categoryTypes = [{
  name: "全部",
  key: "-1"
},
{
  name: "男歌手",
  key: "1"
},
{
  name: "女歌手",
  key: "2"
},
{
  name: "乐队",
  key: "3"
}
]

// 歌手首字母
export const alphaTypes = [{
  key: "A",
  name: "A"
},
{
  key: "B",
  name: "B"
},
{
  key: "C",
  name: "C"
},
{
  key: "D",
  name: "D"
},
{
  key: "E",
  name: "E"
},
{
  key: "F",
  name: "F"
},
{
  key: "G",
  name: "G"
},
{
  key: "H",
  name: "H"
},
{
  key: "I",
  name: "I"
},
{
  key: "J",
  name: "J"
},
{
  key: "K",
  name: "K"
},
{
  key: "L",
  name: "L"
},
{
  key: "M",
  name: "M"
},
{
  key: "N",
  name: "N"
},
{
  key: "O",
  name: "O"
},
{
  key: "P",
  name: "P"
},
{
  key: "Q",
  name: "Q"
},
{
  key: "R",
  name: "R"
},
{
  key: "S",
  name: "S"
},
{
  key: "T",
  name: "T"
},
{
  key: "U",
  name: "U"
},
{
  key: "V",
  name: "V"
},
{
  key: "W",
  name: "W"
},
{
  key: "X",
  name: "X"
},
{
  key: "Y",
  name: "Y"
},
{
  key: "Z",
  name: "Z"
}
]

export const HEADER_HEIGHT = 40

// 播放模式
export const playMode = {
  sequence: 0,//顺序播放
  loop: 1,//单曲循环
  random: 2//随机播放
}