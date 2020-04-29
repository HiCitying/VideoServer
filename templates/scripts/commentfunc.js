// Comments operations
function postComment(vid, content, callback) {
 var reqBody = {
  	'author_id': uid,
  	'content': content
  }


  var dat = {
    'url': 'http://' + window.location.hostname + ':8000/videos/' + vid + '/comments',
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

function listAllComments(vid, callback) {
  var dat = {
    'url': 'http://' + window.location.hostname + ':8000/videos/' + vid + '/comments',
    'method': 'GET',
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

function htmlCommentListElement(cid, author, content) {
  var ele = $('<div/>', {
    id: cid
  });

  ele.append(
    $('<div/>', {
      class: 'comment-author',
      text: author + ' says:'
    })
  );
  ele.append(
    $('<div/>', {
      class: 'comment',
      text: content
    })
  );

  ele.append('<hr style="height: 1px; border:none; color:#EDE3E1;background-color:#EDE3E1">');

    return ele;
}

function htmlVideoListElement(vid, name, ctime) {
  var ele = $('<a/>', {
    href: '#'
  });
  ele.append(
    $('<video/>', {
      width:'320',
      height:'240',
      poster:'/statics/img/preloader.jpg',
      controls: true
      //href: '#'
    })
  );
  ele.append(
    $('<div/>', {
      text: name
    })
  );
  ele.append(
    $('<div/>', {
      text: ctime
    })
  );


  var res = $('<div/>', {
    id: vid,
    class: 'video-item'
  }).append(ele);

  res.append(
    $('<button/>', {
      id: 'del-' + vid,
      type: 'button',
      class: 'del-video-button',
      text: 'Delete'
    })
  );

  res.append(
    $('<hr>', {
      size: '2'
    }).css('border-color', 'grey')
  );

  return res;
}