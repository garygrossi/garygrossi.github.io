
var gl;
var canvas;


function start(){
	canvas = document.getElementById("map");
	
	gl = WebGLUtils.setupWebGL(canvas);

	render();
}




	var vertices = [
		0.0, 0.5,
		0.5,  -0.5,
		-0.5, -0.5,
   	];

function render(){
	///window.requestAnimFrame(render, canvas);
	
	/*for(i = 0; i < vertices.length; i++){
		vertices[i] += 0.00005;
	}*/




	draw(vertices);
}


function draw(vertices) {

	gl.clearColor(0.0, 0.0, 1.0, 1.0);
	gl.enable(gl.DEPTH_TEST);	


	//gl.viewport(0, 0, canvas.width, canvas.height);
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);


   var buffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),
gl.STATIC_DRAW);

   // Create a simple vertex shader
   //
   var vertCode =
        'attribute vec2 coordinates;' +
        'void main(void) {' +
        '  gl_Position = vec4(coordinates, 0.0, 1.0);' +
        '}';

   var vertShader = gl.createShader(gl.VERTEX_SHADER);
   gl.shaderSource(vertShader, vertCode);
   gl.compileShader(vertShader);
   if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(vertShader));

   // Create a simple fragment shader
   //
   var fragCode =
      'void main(void) {' +
      '   gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);' +
      '}';

   var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
   gl.shaderSource(fragShader, fragCode);
   gl.compileShader(fragShader);
   if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(fragShader));

   // Put the vertex shader and fragment shader together into
   // a complete program
   //
   var shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertShader);
   gl.attachShader(shaderProgram, fragShader);
   gl.linkProgram(shaderProgram);
   if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(shaderProgram));

   // Everything we need has now been copied to the graphics
   // hardware, so we can start drawing

   // Clear the drawing surface
   //
   gl.clearColor(0.0, 0.0, 0.0, 1.0);
   gl.clear(gl.COLOR_BUFFER_BIT);

   // Tell WebGL which shader program to use
   //
   gl.useProgram(shaderProgram);

   // Tell WebGL that the data from the array of triangle
   // coordinates that we've already copied to the graphics
   // hardware should be fed to the vertex shader as the
   // parameter "coordinates"
   //
   var coordinatesVar = gl.getAttribLocation(shaderProgram, "coordinates");
   gl.enableVertexAttribArray(coordinatesVar);
   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
   gl.vertexAttribPointer(coordinatesVar, 2, gl.FLOAT, false, 0, 0);

   // Now we can tell WebGL to draw the 3 points that make 
   // up the triangle
   //
   gl.drawArrays(gl.TRIANGLES, 0, );
}

