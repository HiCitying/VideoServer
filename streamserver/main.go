package main

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
)

type middleWareHandler struct {
	r *httprouter.Router
	l *ConnLimiter
}

func NewMiddleWareHandler(r *httprouter.Router, cc int) http.Handler {
	m := middleWareHandler{}
	m.r = r
	m.l = NewConnLimiter(cc)
	return m
}

func (m middleWareHandler) ServeHTTP(w http.ResponseWriter, r *http.Request)  {
	if !m.l.GetConn() {
		sendErrorResponse(w, http.StatusTooManyRequests, "Too many request")
		return
	}
	// TODO 进入HTTP video 服务
	log.Printf("Video Server .")

	m.r.ServeHTTP(w, r)
	defer m.l.ReleaseConn()
}

func RegisterHandlers() *httprouter.Router {
	router := httprouter.New()

	router.GET("/videos/:vid-id", streamHandler)

	router.POST("/upload/:vid-id", uploadHandler)

	router.GET("/testpage", testPageHandler)

	return router
}

func main() {
	r := RegisterHandlers()
	mh := NewMiddleWareHandler(r, 3)
	http.ListenAndServe(":9000", mh)

}
