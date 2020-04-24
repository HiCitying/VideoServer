package main

type ApiBody struct {
	Url string `json:"url"`
	Method string `json:"method"`
	ReqBody string `json:"req_body"`
}

type Error struct {
	Error string `json:"error"`
	ErrorCode string `json:"error_code"`
}

var (
	ErrorRequestNotRecognized = Error{Error: "api not recognized, bad request", ErrorCode: "001"}
	ErrorRequestBodyParseFailed = Error{Error: "requset body is not correct", ErrorCode: "002"}
	ErrorInternalFaults = Error{Error: "internal service error", ErrorCode: "003"}
)