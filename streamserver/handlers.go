package main

import (
	"fmt"
	"github.com/julienschmidt/httprouter"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"
)

func testPageHandler(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	t, err := template.ParseFiles("./streamserver/videos/upload.html")
	if err != nil {
		fmt.Println(err)
	}
	t.Execute(w, nil)
}

func streamHandler(w http.ResponseWriter, r *http.Request, p httprouter.Params)  {
	// TODO 获取一个 请求链接
	log.Printf("StreamHanlder ...")

	vid := p.ByName("vid-id")
	vl := VIDEO_DIR + vid

	// TODO 获取一个 请求链接
	log.Printf("vid : %s", vid)
	video, err := os.Open(vl)
	if err != nil {
		log.Printf("Error when try to open file : %v", err)
		sendErrorResponse(w, http.StatusInternalServerError, "Internal Error")
		return
	}
	w.Header().Set("Content-Type", "video/mp4")
	http.ServeContent(w, r, "", time.Now(), video)

	defer video.Close()
}

func uploadHandler(w http.ResponseWriter, r *http.Request, p httprouter.Params)  {
	r.Body = http.MaxBytesReader(w, r.Body, MAX_UPLOAD_SIZE)
	if err := r.ParseMultipartForm(MAX_UPLOAD_SIZE); err != nil {

		sendErrorResponse(w, http.StatusBadRequest, "File is too big.")
		return
	}

	file, _, err := r.FormFile("file")  //<form name = "file"
	if err != nil {
		sendErrorResponse(w, http.StatusInternalServerError, "Internal Error")
		return
	}

	data, err := ioutil.ReadAll(file)
	if err != nil {
		log.Printf("Read file error : %v", err)
		sendErrorResponse(w, http.StatusInternalServerError, "Internal Error")
	}
	fn := p.ByName("vid-id")
	// TODO
	log.Printf("fn : %s", fn)
	err = ioutil.WriteFile(VIDEO_DIR + fn, data, 0666)
	if err != nil {
		log.Printf("Write file error : %v", err)
		sendErrorResponse(w, http.StatusInternalServerError, "Internal Error")
	}

	w.WriteHeader(http.StatusCreated)
	io.WriteString(w, "Uploaded successfully.")
}
