$(function() {
    
    window.Socket = io.connect();
    window.isControlled = false;
    
    Socket.on('uuid', function(data) {
    	window.allUserInfo.userID = data.userID;
    });
	
	//Socket.on('control', function(data) {
	//	//if (isControlled && data.userID == window.controllingUser) {
	//		//truck.teleportTo(data.lat, data.lon);
        //                console.log('lat:'+data.lat+', lon:'+data.lon+', alt:'+data.alt);
	//	//}
	//});
	
	//Socket.json.emit('location', {
	//	raceID: window.raceID,
	//	userID: window.allUserInfo.userID,
	//	lat: window.allUserInfo.lat,
	//	lon: window.allUserInfo.lon
	//});
    Socket.on('endRace',function(data){
      var result = data.result;
      if(result==='win'){
        $('#win').show();
      }else if(result==='lose'){
        $('#lose').show();
      }
    });
    
    Socket.on('newClient', function(data) {
    	if (document.getElementById('list')) {
    		document.getElementById('list').innerHTML = '';
	    	for (var i = 0; i < data.names.length; i++) {
		    	var uid = data.names[i];
		    	var li = document.createElement('li');
		    	li.innerHTML = uid;
		    	document.getElementById('list').appendChild(li);		    	
		    }
	    }
    });
    
    Socket.on('startRace', function(data) {
    	function getUserPosition(pos){
    	    window.allUserInfo.lon = data.depart.lon;
    	    
    	    switch (pos) {
    	    	case 0:
    				window.allUserInfo.lat = data.depart.lat;
    	    		break;
    	    	case 1:
    		    	window.allUserInfo.lat = data.depart.lat-0.0001;
    	    		break;
    	    	case 2:
    		    	window.allUserInfo.lat = data.depart.lat-0.0002;
    	    		break;
    	    	case 3:
    		    	window.allUserInfo.lat = data.depart.lat-0.0003;
    	    		break;
    	    }
    	}
    	
    	document.body.addEventListener('keydown', keyDownListener, false);
    	document.body.addEventListener('keyup', keyUpListener, false);
    	
    	document.body.addEventListener('unload', function() {
    		GUnload();
    	}, false);
    	
    	var xhr = new XMLHttpRequest();
    	xhr.onreadystatechange = function() {
    		if (xhr.readyState == 4) {
    			var html = xhr.responseText;
    			document.body.innerHTML = html;
    			init();
    			var currentNum;
				var usersList = '';
				console.log ('local: ' + window.allUserInfo.userID);
				for (var x = 0; x < data.users.length; x++) {
					console.log ('remote: ' + data.users[x].userID);
					if(window.allUserInfo.userID == data.users[x].userID) {
						currentNum = x;
					}
					usersList += '\n ' + data.users[x].name;
				}
				console.log("You are user number: " + currentNum);
    			getUserPosition(currentNum); 
                        window.allUserInfo.depart=data.depart;
                        window.allUserInfo.destination=data.destination;
    			window.raceID = data.raceID;
    			
    			//isControlled = confirm('Want to be controlled? Your username: ' + data.users[currentNum].name);
                        
    			
    			if (isControlled) {
    			    window.controllingUser = prompt('Which user would you like to control you? Current users are: ' + usersList);
    			    var matched = false;
    			    for (var i = 0; i < data.users.length; i++) {
    			    	if (data.users[i].name == window.controllingUser) {
    			    		matched = true;
    			    	}
    			    }
    			    while (window.controllingUser == data.users[currentNum].name || !matched) {
    			    	window.controllingUser = prompt('Which user would you like to control you? Current users are: ' + usersList);
    			    	for (var i = 0; i < data.users.length; i++) {
    			    		if (data.users[i].name == window.controllingUser) {
    			    			matched = true;
    			    		}
    			    	}
    			    }
    			    document.body.removeEventListener('keydown', keyDownListener, false);
    			    document.body.removeEventListener('keyup', keyUpListener, false);
    			}
    			
    			//truck.teleportTo(allUserInfo.lat, allUserInfo.lon);
    		}
    	};
    	
		xhr.open('GET', "index.txt", true); 
		xhr.send(null); 
    });
    
    function keyDownListener(event) {
		return keyDown(event);
    };
    
    function keyUpListener(event) {
    	return keyUp(event);
    };

    //Socket.on('control', function(data) {
    //    var axisX = data.x;
    //    var axisY = data.y;
    //    // console.log(axis);
    //    
    //    if (axisX>=0) {
    //      if (axisX < 0.46) {
    //        leftButtonDown = true;
    //        rightButtonDown = false;
    //      } else if (axisX > 0.54) {
    //        leftButtonDown = false;
    //        rightButtonDown = true;
    //      } else {
    //        leftButtonDown = false;
    //        rightButtonDown = false;
    //      }
    //    }
    //    if (axisY>=0) {
    //      if (axisY < 0.48) {
    //        gasButtonDown = false;
    //        reverseButtonDown = true;
    //      } else if (axisY > 0.52) {
    //        gasButtonDown = true;
    //        reverseButtonDown = false;
    //      } else {
    //        gasButtonDown = false;
    //        reverseButtonDown = false;
    //      }
    //    }
    //});
    
    // new Hand({id: 'left'});
    // new Hand({id: 'right'});
    
});

function join(data) {
	Socket.json.emit('join', data);
};
