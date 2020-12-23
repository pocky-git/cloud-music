// 解析 [00:01.997] 这一类时间戳的正则表达式
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1
export default class Lyric {
    /**
     * @params {string} lrc
     * @params {function} handler
    */

    constructor(lrc, handler = () => { }) {
        this.lrc = lrc
        this.lines = []
        this.curLineIndex = 0
        this.state = STATE_PAUSE
        this.handler = handler
        this.startStamp = 0
        this._initLines()
    }

    _initLines() {
        const lrcArr = this.lrc.split('\n')
        for (let i = 0; i < lrcArr.length; i++) {
            const time = timeExp.exec(lrcArr[i])
            if (!time) continue
            const txt = lrcArr[i].replace(timeExp, '').trim()
            if (txt) {
                if (time[3].length === 3) {
                    time[3] = time[3] / 10
                }
                this.lines.push({
                    time: time[1] * 60 * 1000 + time[2] * 1000 + time[3] * 10,
                    txt
                })
            }
        }
    }

    play(offset = 0, isSeek = false) {
        if(!this.lines.length) return
        this.state = STATE_PLAYING
        this.curLineIndex = this._findCurLineIndex(offset)
        this.startStamp = +new Date() - offset
        this._callHandler(this.curLineIndex - 1)
        if (this.curLineIndex < this.lines.length) {
            clearTimeout(this.timer)
            this._playRest()
        }
    }

    _callHandler(i) {
        if (i < 0) return
        this.handler({
            txt: this.lines[i].txt,
            lineNum: i
        })
    }

    _findCurLineIndex(offset) {
        for (let i = 0; i < this.lines.length; i++) {
            if (offset <= this.lines[i].time) {
                return i
            }
        }
        return this.lines.length - 1
    }

    _playRest(isSeek = false) {
        let delay
        const line = this.lines[this.curLineIndex]
        if (isSeek) {
            delay = line.time - (+new Date() - this.startStamp)
        } else {
            const preLine = this.lines[this.curLineIndex - 1] ? this.lines[this.curLineIndex - 1] : 0
            delay = line.time - preLine.time
        }
        this.timer = setTimeout(() => {
            this._callHandler(this.curLineIndex++)
            if (this.curLineIndex < this.lines.length && this.state == STATE_PLAYING) {
                this._playRest()
            }
        }, delay)
    }

    togglePlay(offset) {
        if (this.state === STATE_PLAYING) {
            this.stop()
        } else {
            this.state = STATE_PLAYING
            this.play(offset, true)
        }
    }

    stop() {
        this.state = STATE_PAUSE
        clearTimeout(this.timer)
    }

    seek(offset) {
        this.play(offset, true)
    }
}
