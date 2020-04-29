// Video operations
function createVideo(vname, callback) {
	var reqBody = {
		'author_id': uid,
		'name': vname
	};

	var dat = {
		// 向数据库添加一条记录
		'url': 'http://' + window.location.hostname + ':8000/user/' + uname + '/videos',
		'method': 'POST',
		'req_body': JSON.stringify(reqBody)
	};

	$.ajax({
		url  : 'http://' + window.location.hostname + ':8080/api',
		type : 'post',
		data : JSON.stringify(dat),
		headers: {'X-Session-Id': session},
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
		callback(data, null);
	});
}

function listAllVideos(callback) {
  var dat = {
  	//TODO
	 //	从数据库中读取 Video info
    'url': 'http://' + window.location.hostname + ':8000/user/' + uname + '/videos',
    'method': 'GET',
    'req_body': ''
  };
  $.ajax({
    url  : 'http://' + window.location.hostname + ':8080/api',
    type : 'post',
    data : JSON.stringify(dat),
    headers: {'X-Session-Id': session}, // 带session
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
    callback(data, null);
  });
}

function deleteVideo(vid, callback) {
  var dat = {
    'url': 'http://' + window.location.hostname + ':8000/user/' + uname + '/videos/' + vid,
    'method': 'DELETE',
    'req_body': ''
  };

  $.ajax({
    url  : 'http://' + window.location.hostname + ':8080/api',
    type : 'post',
    data : JSON.stringify(dat),
    headers: {'X-Session-Id': session},
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
    callback(data, null);
  });
}

// DOM operations
function selectVideo(vid) {
  // 
  var url = 'http://' + window.location.hostname + ':9000/videos/'+ vid
    var video = $("#curr-video");
    $("#curr-video:first-child").attr('src', url);
    $("#curr-video-name").text(currentVideo['name']);
    $("#curr-video-ctime").text('Uploaded at: ' + currentVideo['display_ctime']);
    //currentVideoId = vid;
    refreshComments(vid);
}

function refreshComments(vid) {
  listAllComments(vid, function (res, err) {
    if (err !== null) {
      //window.alert("encounter an error when loading comments");
      popupErrorMsg('encounter an error when loading comments');
      return
    }

    var obj = JSON.parse(res);
    $("#comments-history").empty();
    if (obj['comments'] === null) {
      $("#comments-total").text('0 Comments');
    } else {
      $("#comments-total").text(obj['comments'].length + ' Comments');
    }
    obj['comments'].forEach(function(item, index) {
      var ele = htmlCommentListElement(item['id'], item['author'], item['content']);
      $("#comments-history").append(ele);
    });

  });
}