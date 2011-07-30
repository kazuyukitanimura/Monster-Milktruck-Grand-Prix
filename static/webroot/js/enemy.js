window.enemy = null;

var PAGE_PATH = document.location.href.replace(/\/[^\/]+$/, '/');
var MODEL_URL =
  'http://sketchup.google.com/3dwarehouse/download?'
  + 'mid=3c9a1cac8c73c61b6284d71745f1efa9&rtyp=zip&'
  + 'fn=milktruck&ctyp=milktruck';
var MODEL_URL2 =
    'http://sketchup.google.com/3dwarehouse/download?mid=3d64ec9ab5ebe37020fc0d1f64d8ea9c&rtyp=zip&fn=Man+Riding+Segway+i2&ctyp=other&prevstart=0&ts=1202486001000';
var INIT_LOC = {
  lat: 37.423501,
  lon: -122.086744,
  heading: 90
}; // googleplex

var PREVENT_START_AIRBORNE = false;

function Enemy(enemyIdx){
    var me = this;
    me.doTick = true;
    me.enemyIdx = enemyIdx;
    
    window.google.earth.fetchKml(ge,MODEL_URL, function(obj){me.finishInit(obj);});
}

Enemy.prototype.finishInit = function(kml) {
  var me = this;

  walkKmlDom(kml, function() {
    if (this.getType() == 'KmlPlacemark' &&
        this.getGeometry() &&
        this.getGeometry().getType() == 'KmlModel')
      me.placemark = this;
  });

  me.model = me.placemark.getGeometry();
  me.orientation = me.model.getOrientation();
  me.location = me.model.getLocation();

  me.model.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
  me.orientation.setHeading(90);
  me.model.setOrientation(me.orientation);

  ge.getFeatures().appendChild(me.placemark);

  me.balloon = ge.createHtmlStringBalloon('');
  me.balloon.setFeature(me.placemark);
  me.balloon.setMaxWidth(350);
  me.balloon.setForegroundColor(BALLOON_FG);
  me.balloon.setBackgroundColor(BALLOON_BG);

  //me.teleportTo(INIT_LOC.lat, INIT_LOC.lon, INIT_LOC.heading);
  //me.teleportTo(window.allUserInfo.lat, window.allUserInfo.lon, INIT_LOC.heading);

  me.lastMillis = (new Date()).getTime();

  var href = window.location.href;

  me.shadow = ge.createGroundOverlay('');
  me.shadow.setVisibility(false);
  me.shadow.setIcon(ge.createIcon(''));
  me.shadow.setLatLonBox(ge.createLatLonBox(''));
  me.shadow.setAltitudeMode(ge.ALTITUDE_CLAMP_TO_SEA_FLOOR);
  me.shadow.getIcon().setHref('http://earth-api-samples.googlecode.com/svn/trunk/demos/milktruck/shadowrect.png');
  me.shadow.setVisibility(true);
  // ge.getFeatures().appendChild(me.shadow);

  //google.earth.addEventListener(ge, "frameend", function() { me.tick(); });

  //me.cameraCut();

  // Make sure keyboard focus starts out on the page.
  ge.getWindow().blur();

  // If the user clicks on the Earth window, try to restore keyboard
  // focus back to the page.
  google.earth.addEventListener(ge.getWindow(), "mouseup", function(event) {
      ge.getWindow().blur();
    });


  Socket.on('control', function(data) {
      //console.log('lat:'+data.lat+', lon:'+data.lon+', alt:'+data.alt);
    if(window.userIDtoIdx[data.userID]===me.enemyIdx){
      me.model.getLocation().setLatLngAlt(data.lat, data.lon, data.alt);
    }
  });
}
//Enemy.prototype.cameraCut = function() {
//  var me = this;
//  var lo = me.model.getLocation();
//  var la = ge.createLookAt('');
//  la.set(lo.getLatitude(), lo.getLongitude(),
//         10 /* altitude */,
//         ge.ALTITUDE_RELATIVE_TO_SEA_FLOOR,
//         fixAngle(180 + me.model.getOrientation().getHeading() + 45),
//         80, /* tilt */
//         50 /* range */         
//         );
//  ge.getView().setAbstractView(la);
//};

//Enemy.prototype.tick = function(){
    //Socket.on('control', function(data) {
      //if (isControlled && data.userID == window.controllingUser) {
      //truck.teleportTo(data.lat, data.lon);
                        //console.log('lat:'+data.lat+', lon:'+data.lon+', alt:'+data.alt);
    //}
  //});
//}

//Enemy.prototype.scheduleTick = function(){
//    var me = this;
//    if(me.doTick){
//        setTimeout(function(){me.tick();},100);
//    }
//};
