$(document).ready(function() {

	DEFAULT_COOKIE_EXPIRE_TIME = 30;

	uname = '';
	session = '';
	uid = 0;	// 用户id
	currentVideo = null;
	listedVideos = null;

	// 获取当前 cookie 信息
	session = getCookie('session');
	uname = getCookie('username');


	initPage(function() {
		if (listedVideos !== null) {
			currentVideo = listedVideos[0];
			selectVideo(listedVideos[0]['id']);
		}

		$(".video-item").click(function() {
			var self = this.id
  			listedVideos.forEach(function(item, index) {
  				if (item['id'] === self) {
  					currentVideo = item;
  					return
  				}
  			});

  			selectVideo(self);
		});

		$(".del-video-button").click(function() {
			var id = this.id.substring(4);
  			deleteVideo(id, function(res, err) {
  				if (err !== null) {
  					//window.alert("encounter an error when try to delete video: " + id);
  					popupErrorMsg("encounter an error when try to delete video: " + id);
  					return;
  				}

  				popupNotificationMsg("Successfully deleted video: " + id)
  				location.reload();
  			});
		});

		$("#submit-comment").on('click', function() {
			var content = $("#comments-input").val();
  			postComment(currentVideo['id'], content, function(res, err) {
  				if (err !== null) {
  					popupErrorMsg("encounter and error when try to post a comment: " + content);
  					return;
  				}

  				if (res === "ok") {
  					popupNotificationMsg("New comment posted")
    				$("#comments-input").val("");

    				refreshComments(currentVideo['id']);
  				}
  			});
		});
	});

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

	// userhome page event register
	$("#upload").on('click', function() {
  		$("#uploadvideomodal").show();

  	});


	$("#uploadform").on('submit', function(e) {
		e.preventDefault();
	  	var vname = $('#vname').val();

	  	createVideo(vname, function(res, err) {
	  		if (err != null ) {
	  			//window.alert('encounter an error when try to create video');
	  			popupErrorMsg('encounter an error when try to create video');
	  			return;
	  		}

	  		var obj = JSON.parse(res);
	  		var formData = new FormData();
			formData.append('file', $('#inputFile')[0].files[0]);

			$.ajax({
				url : 'http://' + window.location.hostname + ':8080/upload/' + obj['id'],
				//url:'http://127.0.0.1:8080/upload/dbibi',
				type : 'POST',
				data : formData,
				//headers: {'Access-Control-Allow-Origin': 'http://127.0.0.1:9000'},
				crossDomain: true,
				processData: false,  // tell jQuery not to process the data
				contentType: false,  // tell jQuery not to set contentType
				success : function(data) {
				   console.log(data);
				   $('#uploadvideomodal').hide();
				   location.reload();
				   //window.alert("hoa");
				},
				complete: function(xhr, textStatus) {
					if (xhr.status === 204) {
						window.alert("finish")
						return;
					}
					if (xhr.status === 400) {
						$("#uploadvideomodal").hide();
						popupErrorMsg('file is too big');
						return;
					}
				}

			});
	  	});
	});

	$(".close").on('click', function() {
		$("#uploadvideomodal").hide();
	});

	$("#logout").on('click', function() {
		setCookie("session", "", -1)
		setCookie("username", "", -1)
	});


    $(".video-item").click(function () {
    	window.alert("Coming movie...");
  	    var url = 'http://' + window.location.hostname + ':9000/videos/'+ this.id
  	    var video = $("#curr-video");
  	    video[0].attr('src', url);
  	    video.load();
    });
});

function initPage(callback) {
	// 先获取当前用户 getUserId
	getUserId(function(res, err) {	// 返回用户的唯一 id
		//	当前没有用户 cookie 处于当前登录注册界面
		if (err != null) {
			//window.alert("Encountered error when loading user id");
			return;
		}
		var obj = JSON.parse(res);
		uid = obj['id'];
		//window.alert(obj['id']);
		listAllVideos(function(res, err) {	// 获得该用户所有的视频
			if (err != null) {
				//window.alert('encounter an error, pls check your username or pwd');
				popupErrorMsg('encounter an error, pls check your username or pwd');
				return;
			}
			var obj = JSON.parse(res);
			listedVideos = obj['videos'];
			listedVideos.forEach(function(item, index) {
				var ele = htmlVideoListElement(item['id'], item['name'], item['display_ctime']);
				$("#items").append(ele);
			});
			callback();
		});
	});
}

function setCookie(cname, cvalue, exmin) {
    var d = new Date();
    d.setTime(d.getTime() + (exmin * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function popupNotificationMsg(msg) {
	var x = document.getElementById("snackbar");
	$("#snackbar").text(msg);
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
}

function popupErrorMsg(msg) {
	var x = document.getElementById("errorbar");
	$("#errorbar").text(msg);
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
}







