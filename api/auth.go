package main

import (
	"VideoServer/api/session"
	"log"
	"net/http"
)

var (
	HEADER_FIELD_SESSION = "X-Session-Id"
	HEADER_FIELD_UNAME = "X-User-Name"
)

func ValidateUserSession(r *http.Request) bool {
	sid := r.Header.Get(HEADER_FIELD_SESSION)
	// TODO Test - 5
	log.Printf("Validate UserSession : %v", sid)
	if len(sid) == 0 {
		return false
	}

	uname, ok := session.IsSessionExpire(sid)
	if ok {
		return false
	}

	// 用户 Session 未过期 加入 r.Head
	// TODO
	log.Printf("Add Session username : %s", uname)
	r.Header.Add(HEADER_FIELD_UNAME, uname)
	return true
}

func ValidateUser(w http.ResponseWriter, r *http.Request) bool {
	uname := r.Header.Get(HEADER_FIELD_UNAME)
	if len(uname) == 0 {
		//sendErrorResponse(w)
		return false
	}
	return true
}