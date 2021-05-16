var renderer;
var scene;
var camera;

var cube;


var pole;


var RAD = 2.5; /* Constant radius for sphere */

var objs = [];

var xRot = 1.7;
var yRot = 0.6;
var startX = 0;
var startY = 0;

var xMouseLast = 0.0;
var yMouseLast = 0.0;
var tracking = false;

window.onmousemove = function(e){
	if(tracking){

	xRot += (-xMouseLast + e.clientX) / 100;
	yRot += (-yMouseLast + e.clientY) / 100;


	xMouseLast = e.clientX;
	yMouseLast = e.clientY;
	}
}

window.onmousedown = function(e){
	xMouseLast = e.clientX;
	yMouseLast = e.clientY;
	tracking = true;

}


window.onmouseup = function(e){
	tracking = false;
}




function drawBoundaries(){
	$.get("xml/states.xml", null, function (data, textStatus) {
	    $(data).find("state").each( function(){
		var verts = [];

		$(this).find("point").each( function(){
			var i = verts.length;
			
			//console.log(this.getAttribute("lat") + " " + this.getAttribute("lat")

			verts[i] = posVector(this.getAttribute("lat"), this.getAttribute("lng"), RAD + 0.04); 
		});
	
		drawPath(verts);
		
	
	    });
	}, 'xml');

}

function latlongPlot(lat, long){
	/* Latitude: -90deg south poll to 90 north poll */
	/* Longitude -180left < 0 <= 180right */

			
	var i = objs.length;

	var poleGeo = new THREE.SphereGeometry(0.02, 32, 32);  //new THREE.CylinderGeometry(0.01,0.01, 10, 32);


	lat = lat * (Math.PI / 180);
	long = long * (Math.PI / 180);


	/* longitude is phi */

	var v = posVector(lat, long, RAD);

	var z = RAD * Math.cos(lat) * Math.cos(long)
	var x = RAD * Math.cos(lat) * Math.sin(long)
	var y = RAD * Math.sin(lat)

	poleGeo.applyMatrix( new THREE.Matrix4().makeTranslation( x, y, z ) );

	/*poleGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -1.56) );
	poleGeo.applyMatrix( new THREE.Matrix4().makeRotationY( 3.2) );
	poleGeo.applyMatrix( new THREE.Matrix4().makeRotationZ( 0) );
	*/

	var material2 = new THREE.MeshBasicMaterial( { color: 0xffbb00 } );
	objs[i] = new THREE.Mesh(poleGeo, material2);


	scene.add(objs[i]);
}




function jsonParse(){
	//return;
	$.getJSON( "scripts/jsonOut4.json", function( data ) {
		var res = data["correlation_results"];

		var verts = [];

		for(i = 0; i <  res['lat'].length; i++){
			if(res['lat'][i] != ""){
				verts[verts.length] = posVector(res['lat'][i], res['long'][i], RAD + 0.5);
				//latlongPlot(res['lat'][i], res['long'][i]);
			}
		}

		//drawPath(verts);
		drawMesh(verts, []);
	});

}

function mesh(/*verts, alphas, width*/){
	var geometry = new THREE.Geometry();
	


	var width = 2;
	var height = 2

	var verts = [
		posVector(0, 10, RAD + 0.2),
		posVector(10, 10, RAD + 0.2),
		posVector(0, 0, RAD + 0.2),
		posVector(10, 0, RAD + 0.2)
	];

/*
	geometry.vertices.push( new THREE.Vector3( -10, 10, 0 ) );
	geometry.vertices.push( new THREE.Vector3( -10, -10, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 10, -10, 0 ) );

*/

	for(i = 0; i < verts.length; i++){
		geometry.vertices.push(verts[i]);
	}

	for(i = 0; i < verts.length; i++){
		if( i != 0 && ((i + 1) % width) == 0){
			continue;
		}

		if(i + width < verts.length){ /* Draw down triangle */
			geometry.faces.push( new THREE.Face3( i, i + 1, i + 2 ) );
		}

		if( i - width + 1 > 0){ /* Draw up triangle */
			geometry.faces.push( new THREE.Face3( i, i + 1, i - width + 1 ) );
		}
	}

	geometry.computeBoundingSphere();


	var i = objs.length;

	var material2 = new THREE.MeshBasicMaterial( { color: 0xffbb00 } );
	material2.side = THREE.DoubleSide;

	objs[i] = new THREE.Mesh(geometry, material2);


	scene.add(objs[i]);
}


function start(){

	//posVector(90, 0, 3) //North pole (0, 1, 0)
	//posVector(0, 0, 3) // (0, 0, -1)
	//posVector(0, 90, 3) // (1, 0, 0)

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	/////////var tex = THREE.ImageUtils.loadTexture("img/globe-outline.png");
	
	var geometry = new THREE.SphereGeometry(RAD, 128, 128);  //new THREE.CubeGeometry(1,1,1);
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, /*map: tex*/ } ); //new THREE.MeshLambertMaterial({ map: tex }); //new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	cube = new THREE.Mesh( geometry, material );
	scene.add( cube );


	var poleGeo = new THREE.CylinderGeometry(0.01,0.01, 10, 32);
	var material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	pole = new THREE.Mesh(poleGeo, material2);

	scene.add(pole);


	objs[0] = cube;
	objs[1] = pole;
	

	latlongPlot(39.9500, 75.1700);
	//latlongPlot(51.5072, 0.1275);
	latlongPlot(90, 0);
	latlongPlot(0, 0);

	latlongPlot(10, 0);
	latlongPlot(0, 10)
	latlongPlot(10, 10);

	mesh();

	
	drawBoundaries();

	/////jsonParse();


	camera.position.z = 5;
	
	/*cube.scale.x = 2.0;
	cube.scale.y = 2.0;
	cube.scale.z = 2.0;
	*/

	for(var i = 0; i < objs.length; i++){
		objs[i].position.y -= 0;  ///3;
	}

	leap();

	render();
}


/*function drawTile() {

	var rectLength = 120, rectWidth = 40;
	var rectShape = new THREE.Shape();
	rectShape.moveTo( 0,0 );
	rectShape.lineTo( 0, rectWidth );
	rectShape.lineTo( rectLength, rectWidth );
	rectShape.lineTo( rectLength, 0 );
	rectShape.lineTo( 0, 0 );
	var rectGeom = new THREE.ShapeGeometry( rectShape );
	var rectMesh = new THREE.Mesh( rectGeom, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) ; 

	scene.add( rectMesh );
}*/





var lastFrame;
function leap(){
	var controller = new Leap.Controller({enableGestures: true});

//    camera.position.x = 0;
//    camera.position.y = 1;
//    camera.position.z = 5;


    var startX = camera.position.x;
    var startY = camera.position.y;
    var startZ = camera.position.z;

//    var startRotX = xRot;
//    var startRotY = yRot;

    var state  = null;
    var startFrame = null;

    var state2  = null;
    var startFrame2 = null;

	controller.loop(function(frame) {


//        var xTriggered = 0;
//        $( "#target" ).keypress(function( event ) {
//            if ( event.which == 65 ) {
//
//                camera.position.x = camera.position.x +1;
//
//                event.preventDefault();
//            }
//            xTriggered++;;
//        });

        for (var i in frame.handsMap) {
			var hand = frame.handsMap[i];


            if (state == null) {
                if (frame.hands.length > 0 && frame.pointables.length <= 1 ) {
                    startFrame = frame;

                    startZ = camera.position.z;

                    startRotX = xRot;
                    startRotY = yRot;

                    state = 'moving';
                }
            } else if (state == 'moving') {
                var t = hand.translation(lastFrame);

                if (Math.abs(t[2]) > Math.abs(t[1])+5 || Math.abs(t[2]) > Math.abs(t[0])+5)
                {
                camera.position.z = -t[2]/80  + startZ;
                }
                else
                {
                xRot = t[0]/100  + startRotX;
                yRot = -t[1]/100  + startRotY;
                }

                if (frame.hands.length == 1 || frame.pointables.legnth > 1) {
                    state = null;
                }
            }


            if (frame.gestures.length > 0) {
                for (var i = 0; i < frame.gestures.length; i++) {
                    var gesture = frame.gestures[i];

                    if (gesture.type == "swipe") {
                        //Classify swipe as either horizontal or vertical
                        var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
                        //Classify as right-left or up-down
                        if(isHorizontal){
                            if(gesture.direction[0] > 0){
                                swipeDirection = "right";
                            } else {
                                swipeDirection = "left";
                            }
                        } else { //vertical
                            if(gesture.direction[1] > 0){
                                swipeDirection = "up";
                            } else {
                                swipeDirection = "down";
                            }
                        }

                        if (swipeDirection == "up")
                        {
                            camera.position.y = camera.position.y + .005;
                        }

                        if (swipeDirection == "down")
                        {
                            camera.position.y = camera.position.y - .005;
                        }

                        if (swipeDirection == "left")
                        {
                            camera.position.x = camera.position.x + .005;
                        }

                        if (swipeDirection == "right")
                        {
                            camera.position.x = camera.position.x - .005;
                        }
                    }
                }
            }


//				var v = hand.translation(lastFrame);  //frame.handsMa[i].palmVelocity
//				var sign = v[0] > 0 ? 1 : -1
//				camera.position.z += sign * 0.02* Math.sqrt(v[2]*v[2]);//+v[1]*v[1]+v[2]*v[2]


				/* Bound the zoom */

				if(camera.position.z < RAD + .2){
					camera.position.z = RAD + .2;
				}
				if(camera.position.z > 20){
					camera.position.z = 10;
				}


			//}


        	}

		lastFrame = frame;

	});

}


function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);

	/*cube.rotation.x += 0.01;
	pole.rotation.x += 0.01;

	cube.rotation.y += 0.02;
	pole.rotation.y += 0.02;

	for(var i = 0; i < objs.length; i++){
		objs[i].rotation.x += 0.01;
		objs[i].rotation.y += 0.02;
	}*/

	//cube.scale.x += 0.04

	for(var i = 0; i < objs.length; i++){
		objs[i].rotation.y = xRot;
		objs[i].rotation.x = yRot;
	}

}
