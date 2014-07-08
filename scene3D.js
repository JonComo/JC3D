//Basic 3d engine for displaying points and lines

scenes = []; //Holds multiple scenes if necessary

function TDScene(canvasName)
{
	this.canvas = document.getElementById(canvasName);
	this.context = canvas.getContext('2d');
	
	this.canvas.addEventListener("mousedown", mouseDown, false);
	this.canvas.addEventListener("mouseup", mouseUp, false);
	this.canvas.addEventListener("mousemove", mouseMove, false);
	this.canvas.addEventListener("mousewheel", mouseWheel, false);
	
	window.addEventListener("keydown", keyDown);
	window.addEventListener("keyup", keyUp);
	
	this.matrix = new Matrix3D();
	
	this.rotationX = 0;
	this.rotationY = 0;
	
	this.translationX = 0;
	this.translationY = 0;
	
	this.scale = 1;
	
    this.width = this.canvas.width;
    this.height = this.canvas.height;
	
    this.points = [];
	this.lines = [];
	
	this.loop = function(){}
	
    this.render = function()
	{	
		this.loop();
		
		if (this.scale < 0.3) this.scale = 0.3;
		if (this.scale > 100) this.scale = 100;
		
		this.context.fillStyle = "#FFFFFF";
		this.context.fillRect(0, 0, this.width, this.height);
		
		this.matrix.identity();
		this.matrix.scale(this.scale, this.scale, this.scale);
		this.matrix.rotateX(this.rotationX);
		this.matrix.rotateY(this.rotationY);
		this.matrix.translate(this.width/2 + this.translationX * this.scale, this.height/2 + this.translationY * this.scale, 0);
		
		this.context.fillStyle = "#000000";
		for (var i = 0; i < this.points.length; i++)
		{
			point = this.points[i];
			point.render(this);
		}
		for (var i = 0; i < this.lines.length; i++)
		{
			line = this.lines[i];
			line.render(this);
		}
    }
	
	this.clear = function(){
		this.lines = [];
		this.points = [];
	}
	
	scenes.push(this);
	
	console.log("New scene created, canvas: " + this.canvas);
}

//TDPoint Class
function TDPoint(x, y, z)
{	
	this.x = x;
	this.y = y;
	this.z = z;
	
	this.flat = function(scene){
		var transformed = scene.matrix.transformPoint(this);
		
		return {"x": transformed.x, "y": transformed.y};
	}
	
	this.render = function(scene){
		var flat = this.flat(scene);
		
		scene.context.fillRect(flat.x, flat.y, 2, 2);
	}
}

//TDLine Class
function TDLine(start, end)
{
	this.start = start;
	this.end = end;
	
	
	this.render = function(scene){
		var sFlat = this.start.flat(scene);
		var eFlat = this.end.flat(scene);
		
		scene.context.beginPath();
		scene.context.moveTo(sFlat.x, sFlat.y);
		scene.context.lineTo(eFlat.x, eFlat.y);
		scene.context.stroke();
	}
}

// Main Loop
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
function main()
{
	for (var i = 0; i<scenes.length; i++){
		scene = scenes[i];
		scene.render();
	}
	
	requestAnimationFrame(main);
};

main();