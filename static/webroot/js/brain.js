$(function() {
    
    window.Socket = io.connect();

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
