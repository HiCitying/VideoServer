$(document).ready(function() {
	DEFAULT_COOKIE_EXPIRE_TIME = 30;

	uname = '';
	session = '';
	uid = 0;
	currentVideo = null;
	listedVideos = null;

	session = getCookie('session');
	uname = getCookie('username');

	// home page event registry
	$("#regbtn").on('click', function(e) {
		$("#regbtn").text('Loading...')
    		e.preventDefault()
    		registerUser(function(res, err) {
    			if (err != null) {
    				$('#regbtn').text("Register")
    				popupErrorMsg('encounter an error, pls check your username or pwd');
    				return;
    			}

    			var obj = JSON.parse(res);
    			setCookie("session", obj["session_id"], DEFAULT_COOKIE_EXPIRE_TIME);
    			setCookie("username", uname, DEFAULT_COOKIE_EXPIRE_TIME);
    			$("#regsubmit").submit();
    		});
	});

	$("#siginbtn").on('click', function(e) {

		$("#siginbtn").text('Loading...')
    	e.preventDefault();
    	signinUser(function(res, err) {
    		if (err != null) {
    			$('#siginbtn').text("Sign In");
    			//window.alert('encounter an error, pls check your username or pwd')
    			popupErrorMsg('encounter an error, pls check your username or pwd');
    			return;
    		}

    		var obj = JSON.parse(res);
    		setCookie("session", obj["session_id"], DEFAULT_COOKIE_EXPIRE_TIME);
    		setCookie("username", uname, DEFAULT_COOKIE_EXPIRE_TIME);
    		$("#siginsubmit").submit();
    	});
	});

	$("#signinhref").on('click', function() {
		$("#regsubmit").hide();
		$("#siginsubmit").show();
	});

	$("#registerhref").on('click', function() {
		$("#regsubmit").show();
		$("#siginsubmit").hide();
	});
});
// User operations
function registerUser(callback) {
	var username = $("#username").val();
	var pwd = $("#pwd").val();
	var apiUrl = window.location.hostname + ':8080/api';

	if (username == '' || pwd == '') {
		callback(null, err);
	}

	var reqBody = {
		'user_name': username,
		'pwd': pwd
	}

	var dat = {
		'url': 'http://'+ window.location.hostname + ':8000/user',
		'method': 'POST',
		'req_body': JSON.stringify(reqBody)
	};




	$.ajax({
		url  : 'http://' + window.location.hostname + ':8080/api',
		type : 'post',
		data : JSON.stringify(dat),
		statusCode: {
			500: function() {
				callback(null, "internal error");
			}
		},
		complete: function(xhr, textStatus) {
			if (xhr.status >= 400) {
				callback(null, "Error of Signin");
				return;
			}
		}
	}).done(function(data, statusText, xhr){
		if (xhr.status >= 400) {
			callback(null, "Error of register");
			return;
		}

		uname = username;
		callback(data, null);
	});
}

function signinUser(callback) {
	var username = $("#susername").val();
	var pwd = $("#spwd").val();
	var apiUrl = window.location.hostname + ':8080/api';

	if (username == '' || pwd == '') {
		callback(null, err);
	}

	var reqBody = {
		'user_name': username,
		'pwd': pwd
	}

	var dat = {
		'url': 'http://'+ window.location.hostname + ':8000/user/' + username,
		'method': 'POST',
		'req_body': JSON.stringify(reqBody)
	};

	$.ajax({
		url  : 'http://' + window.location.hostname + ':8080/api',
		type : 'post',
		data : JSON.stringify(dat),
		statusCode: {
			500: function() {
				callback(null, "Internal error");
			}
		},
		complete: function(xhr, textStatus) {
			if (xhr.status >= 400) {
				callback(null, "Error of Signin");
				return;
			}
		}
	}).done(function(data, statusText, xhr){
		if (xhr.status >= 400) {
			callback(null, "Error of Signin");
			return;
		}
		uname = username;

		callback(data, null);
	});
}


function getUserId(callback) {
	var dat = {
		'url': 'http://' + window.location.hostname + ':8000/user/' + uname,
		'method': 'GET'
	};
	$.ajax({
		url: 'http://' + window.location.hostname + ':8080/api',
		type: 'post',
		data: JSON.stringify(dat),
		headers: {'X-Session-Id': session},
		statusCode: {
			500: function() {
				callback(null, "Internal Error");
			}
		},
		complete: function(xhr, textStatus) {
			if (xhr.status >= 400) {
				callback(null, "Error of getUserId");
				return;
			}
		}
	}).done(function (data, statusText, xhr) {
		callback(data, null);
	});
}

function initPage(callback) {
	getUserId(function(res, err) {
		if (err != null) {
			window.alert("Encountered error when loading user id");
			// 没有用户登录信息直接返回
			return;
		}
		// Test - 2
		var obj = JSON.parse(res);
		uid = obj['id'];
		//window.alert(obj['id']);
		listAllVideos(function(res, err) {
			if (err != null) {
				//window.alert('encounter an error, pls check your username or pwd');
				popupErrorMsg('encounter an error, pls check your username or pwd');
				return;
			}
			var obj = JSON.parse(res);
			listedVideos = obj['videos'];
			obj['videos'].forEach(function(item, index) {
				var ele = htmlVideoListElement(item['id'], item['name'], item['display_ctime']);
				$("#items").append(ele);
			});
			callback();
		});
	});
}
