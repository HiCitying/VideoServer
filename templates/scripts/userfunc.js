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
				callback(null, "Error of Register");
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
