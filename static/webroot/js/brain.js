$(function() {
    
    window.Socket = io.connect();
    
    Socket.on('uuid', function(data) {
    	window.allUserInfo.id = data.id;
    });
    
function startRace(data) {
	var currentNum = getCurrentNum();
	getUserPosition(currentNum); 
	window.raceID = data.raceID;
	        
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
	
	function getCurrentNum() {
	    for (x = 0; x < data.users.length; x++) {
	        if(allUserInfo.userid == data.users[x].userid){
	            return x;
	        }
	    }
	}
	
	truck.teleportTo(allUserInfo.lat, allUserInfo.lon);
}
    
    Socket.on('startRace', function(data) {
    	var xhr = new XMLHttpRequest();
    	xhr.onreadystatechange = function() {
    		if (xhr.readyState == 4) {
    			var data = xhr.responseText;
    			document.body.innerHTML = data;
    			init();
    			startRace(data);
    		}
    	};
    	
		xhr.open('GET', "index.txt", true); 
		xhr.send(null); 
		
		document.body.addEventListener('keydown', function(event) {
			return keyDown(event);
		}, false);
		
		document.body.addEventListener('keyup', function(event) {
			return keyUp(event);
		}, false);
		
		document.body.addEventListener('unload', function() {
			GUnload();
		}, false);
    });

    Socket.on('message', function(data) {
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