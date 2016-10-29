/* Returns a castesian vector from the circle center based on the latitude and longitude  */
function posVector(lat, long, r){

/*
posVector(90, 0) //North pole (0, 1, 0)
posVector(0, 0) // (0, 0, 1)
posVector(0, 90) // (1, 0, 0)

*/

	lat = lat * (Math.PI / 180);
	long = long * (Math.PI / 180);

	var z = r * Math.cos(lat) * Math.cos(long)
	var x = r * Math.cos(lat) * Math.sin(long)
	var y = r * Math.sin(lat)

	//console.log("(" + x + ", " + y + ", " + z + ")");

	return new THREE.Vector3(x, y, z);
}


function drawPath(verts){

	var material = new THREE.LineBasicMaterial({
		color: 0x0000ff
	});

	var geometry = new THREE.Geometry();

	for(i = 0; i < verts.length; i++){
		geometry.vertices.push(verts[i]);
	}

	var line = new THREE.Line( geometry, material );
	scene.add( line );

	objs[objs.length] = line;
}


/* Draws a 3d mesh of arbitrary points */
function drawMesh(verts, alphas){
	var geometry = new THREE.Geometry();
	
	/* First get all vertices into the geometry so that faces can be formed */
	for(i = 0; i < verts.length; i++){
		geometry.vertices.push(verts[i]);
	}


	var links = [];
	for(i = 0; i < verts.length; i++){
		links[i] = [];
	}

	/* All unlinked vertices- vertex positions linked are marked as null */
	var buckets = verts.slice(0) /* This clones the array */;

	for(i = 0; i < buckets.length; i++){
		if(buckets[i] == null)
			continue;

		var minInPrev = 0; //Used to store the previous value of index and knowing the second closest point
		var minIndex = -1;
		var minDist = Number.MAX_VALUE;

		/* Initialize the vector used for calculations */
		var distV = new THREE.Vector3();

		for(j = 0; j < verts.length; j++){
			if(i == j)
				continue;

			if(links[j].indexOf(i) > -1)
				continue;

			distV.subVectors(verts[i], verts[j]);

			var dist = distV.length();
			if(dist < minDist){
				minDist = dist;
				minInPrev = minIndex;
				minIndex = j;
			}
		}


		if(minIndex != -1){
			geometry.faces.push( new THREE.Face3( i, minInPrev, minIndex ) );
			
			links[i].push(minInPrev);
			links[i].push(minIndex);
			
		/* Set the three vertices as linked */
			buckets[i] = null;
		//buckets[minInPrev] = null;
		//buckets[minIndex] = null;

		}
	}

	geometry.computeBoundingSphere();


	var i = objs.length;

	var material2 = new THREE.MeshBasicMaterial( { color: 0xffbb00 } );
	material2.side = THREE.DoubleSide;

	objs[i] = new THREE.Mesh(geometry, material2);


	scene.add(objs[i]);
}

