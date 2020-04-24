package main

import (
	"encoding/json"
	"github.com/julienschmidt/httprouter"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
)

type HomePage struct {
	Name string
}

type UserPage struct {
	Name string
}

func homeHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params)  {
	cname, err1 := r.Cookie("username")
	sid , err2 := r.Cookie("session")
	//TODO   Test-1
	log.Printf("cname %v, sid %v",cname, sid)

	if err1 != nil || err2 != nil {
		p := HomePage{Name: "Visitor"}
		t, e := template.ParseFiles("./templates/home.html")
		if e != nil {
			log.Printf("Parsing templates home.html error : %v", e)
		}

		t.Execute(w, p)
		return
	}

	if len(cname.Value) != 0 && len(sid.Value) != 0 {
		http.Redirect(w, r, "/userhome", http.StatusFound)
	}

}


func userHomeHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params)  {
	cname, err1 := r.Cookie("username")
	_ , err2 := r.Cookie("session")

	if err1 != nil || err2 != nil {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	fname := r.FormValue("username")

	var p *UserPage
	if len(cname.Value) != 0 {
		p = &UserPage{
			Name: cname.Value,
		}
	} else if len(fname) != 0 {
		p = &UserPage{
			Name: fname,
		}
	}
	// TODO
	// 用户登录成功跳转到 Userhome 操作界面 将用户的 UserName 显示在 UserHomePage 页面

	t, e := template.ParseFiles("./templates/userhome.html")
	if e != nil {
		log.Printf("Parsing userhome.html error : %v", e)
		return
	}

	t.Execute(w, p)
}

func apiHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params)  {
	if r.Method != http.MethodPost {
		re, _ := json.Marshal(ErrorRequestNotRecognized)
		io.WriteString(w, string(re))
		return
	}

	res, _ := ioutil.ReadAll(r.Body)
	// TODO Test - 2
	log.Printf("API res : %v", string(res))
	apiBody := &ApiBody{}

	if err := json.Unmarshal(res, apiBody); err != nil {
		re, _ := json.Marshal(ErrorRequestBodyParseFailed)
		io.WriteString(w, string(re))
		return
	}

	// TODO Test 7
	log.Printf("apiBody : %s", apiBody)
	request(apiBody, w, r)
	defer r.Body.Close()
}

func proxyHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params)  {
	u, _ := r.URL.Parse("http://127.0.0.1:9000/")
	proxy := httputil.NewSingleHostReverseProxy(u)
	proxy.ServeHTTP(w, r)
}