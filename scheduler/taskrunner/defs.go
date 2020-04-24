package taskrunner

const (
	READY_TO_DISPATCH = "d"
	READY_TO_EXECUE = "e"
	CLOSE = "c"

	VIDEO_PATH = "./streamserver/videos/"
)

type ControlChan chan string

type dataChan chan interface{}

type fn func(dc dataChan) error