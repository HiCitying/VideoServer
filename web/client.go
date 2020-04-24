package main

import (
	"log"
	"net/http"
	"bytes"
	"io"
	"io/ioutil"
	"encoding/json"
)

var HttpClient *http.Client

func init()  {
	HttpClient = &http.Client{}
}

func request(b *ApiBody, w http.ResponseWriter, r *http.Request)  {
	var resp *http.Response
	var err error

	switch b.Method {
	case http.MethodGet:
		req, _ := http.NewRequest("GET", b.Url, nil)
		req.Header = r.Header
		// TODO Test - 3
		//log.Printf("req is %v", req)
		resp, err = HttpClient.Do(req)
		if err != nil {
			log.Printf("HttpClient GET error : %v",err)
			return
		}
		normalResponse(w, resp)
	case http.MethodPost:
		req, _ := http.NewRequest("POST", b.Url, bytes.NewBuffer([]byte(b.ReqBody)))
		// TODO Test - 7
		log.Printf("HttpClient Login %s", req)
		req.Header = r.Header
		resp, err = HttpClient.Do(req)
		if err != nil {
			log.Printf("HttpClient POST error : %v",err)
			return
		}
		normalResponse(w, resp)
	case http.MethodDelete:
		req, _ := http.NewRequest("DELETE", b.Url, nil)
		req.Header = r.Header
		resp, err = HttpClient.Do(req)
		if err != nil {
			log.Printf("HttpClient DELETE error : %v",err)
			return
		}
		normalResponse(w, resp)
	default:
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, "Bad api request")
	}
}

func normalResponse(w http.ResponseWriter, r *http.Response)  {
	res, err := ioutil.ReadAll(r.Body)
	if err != nil {
		re, _ := json.Marshal(ErrorInternalFaults)
		w.WriteHeader(500)
		io.WriteString(w, string(re))
		return
	}

	w.WriteHeader(r.StatusCode, )
	io.WriteString(w, string(res))
}