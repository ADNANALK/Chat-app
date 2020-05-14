let socket = io();

function scrollToBottom() {
  let messages = document.querySelector('#messages').lastElementChild;
  messages.scrollIntoView();
}

socket.on('connect', function() {
  let searchQuery = window.location.search.substring(1);
  let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

  socket.emit('join', params, function(err) {
    if(err){
      alert(err);
      window.location.href = '/';
    }else {
      console.log('No Error');
    }
  })
});

socket.on('disconnect', function() {
  console.log('disconnected from server.');
});

socket.on('updateUsersList', function (users) {
  let ul = document.createElement('ul');

  users.forEach(function (user) {
    let li = document.createElement('li');
    li.innerHTML = user;
    ul.appendChild(li);
  });

  let usersList = document.querySelector('#users');
  usersList.innerHTML = "";
  usersList.appendChild(ul);
})

socket.on('newMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('LT');
  const template = document.querySelector('#message-template').innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });

  const div = document.createElement('div');
  div.innerHTML = html

  document.querySelector('#messages').appendChild(div);
  scrollToBottom();
});

/*socket.on('newLocationMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('LT');
  console.log("newLocationMessage", message);

  const template = document.querySelector('#location-message-template').innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  const div = document.createElement('div');
  div.innerHTML = html

  document.querySelector('#messages').appendChild(div);
  scrollToBottom();
});*/

/*document.querySelector('#send-location').addEventListener('click', function(e) {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.')
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
  }, function() {
    alert('Unable to fetch location.')
  })
});*/

document.querySelector('#submit-btn').addEventListener('click', function(e) {
  e.preventDefault();

  socket.emit("createMessage", {
    text: document.querySelector('input[name="message"]').value
  }, function() {
    document.querySelector('input[name="message"]').value = '';
  })
});

socket.on('user image', image);
function image (message) {
  console.log('test test: ', message)
  const formattedTime = moment(message.createdAt).format('LT');
  const template = document.querySelector('#img-message-template').innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });

  const div = document.createElement('div');
  div.innerHTML = html

  document.querySelector('#messages').appendChild(div);
  scrollToBottom();
}

$('#imagefile').bind('change', function(e){

   // in small size
  ImageTools.resize(e.originalEvent.target.files[0], {
    width: 400, // maximum width
    height: 240 // maximum height
  }, function(blob, didItResize) {
    // didItResize will be true if it managed to resize it, otherwise false (and will return the original file as 'blob')
    var reader = new FileReader();
    reader.onload = function(evt){
      //image('me', evt.target.result);
      socket.emit('user image', evt.target.result);
    };
    reader.readAsDataURL(blob);
    // you can also now upload this blob using an XHR.
  });


  // if you need in original size
  /*
  var data = e.originalEvent.target.files[0];var reader = new FileReader();
  reader.onload = function(evt){
    //image('me', evt.target.result);
    socket.emit('user image', evt.target.result);
  };
  reader.readAsDataURL(data);*/
});






/*
compress(e) {
  const width = 500;
  const height = 300;
  const fileName = e.target.files[0].name;
  const reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = event => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      const elem = document.createElement('canvas');
      elem.width = width;
      elem.height = height;
      const ctx = elem.getContext('2d');
      // img.width and img.height will contain the original dimensions
      ctx.drawImage(img, 0, 0, width, height);
      ctx.canvas.toBlob((blob) => {
        const file = new File([blob], fileName, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
      }, 'image/jpeg', 1);
    },
        reader.onerror = error => console.log(error);
  };
}*/
