$(function() {
    
    window.Socket = io.connect();
    
    Socket.on('uuid', function(data) {
    	window.allUserInfo.id = data.userID;
    });
	
	Socket.on('control', function(data) {
		if (isControlled && data.userID == window.controllingUser) {
			truck.teleportTo(data.lat, data.lon);
		}
		
		Socket.json.emit('location', {
			raceID: raceID,
			userID: userid,
			lat: lat,
			lon: lon
		});
	});
    
    Socket.on('startRace', function(data) {
    	function getUserPosition(pos){
    	    allUserInfo.lon = data.depart.lon;
    	    
    	    switch (pos) {
    	    	case 0:
    				allUserInfo.lat = data.depart.lat-.0001;
    	    		break;
    	    	case 1:
    		    	allUserInfo.lat = data.depart.lat-.0001;
    	    		break;
    	    	case 2:
    		    	allUserInfo.lat = data.depart.lat-.0002;
    	    		break;
    	    	case 3:
    		    	allUserInfo.lat = data.depart.lat-.0003;
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
				var usersLength = data.users.length - 1;
				for (x = 0; x < data.users.length; x++) {
				    if(allUserInfo.id == data.users[x].userid){
				        currentNum = x;
				    }
				}
    			getUserPosition(currentNum); 
    			window.raceID = data.raceID;
    			
    			var isControlled = confirm('Want to be controlled? You are user ' + window.allUserInfo.id + '.');
    			if (isControlled) {
    			    window.controllingUser = prompt('Which user would you like to control you? 0 through ' + usersLength + ':', '');
    			    while (window.controllingUser == currentNum) {
    			    	window.controllingUser = prompt('No! 0 through ' + usersLength + ':', '');
    			    }
    			    document.body.removeEventListener('keydown', keyDownListener, false);
    			    document.body.removeEventListener('keyup', keyUpListener, false);
    			}
    			
    			truck.teleportTo(allUserInfo.lat, allUserInfo.lon);
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

    Socket.on('control', function(data) {
        var axisX = data.x;
        var axisY = data.y;
        // console.log(axis);
        
        if (axisX>=0) {
          if (axisX < 0.46) {
            leftButtonDown = true;
            rightButtonDown = false;
          } else if (axisX > 0.54) {
            leftButtonDown = false;
            rightButtonDown = true;
          } else {
            leftButtonDown = false;
            rightButtonDown = false;
          }
        }
        if (axisY>=0) {
          if (axisY < 0.48) {
            gasButtonDown = false;
            reverseButtonDown = true;
          } else if (axisY > 0.52) {
            gasButtonDown = true;
            reverseButtonDown = false;
          } else {
            gasButtonDown = false;
            reverseButtonDown = false;
          }
        }
    });
    
    // new Hand({id: 'left'});
    // new Hand({id: 'right'});
    
});

function join(data) {
	Socket.json.emit('join', data);
};
