
function matrix_disp(width, height){
	this.init = init;	
	this.disp_frame = disp_frame;
	//this.animate = animate;
	//this.change = change;
	this.play = play;
}

var container, stats;
var camera, scene, renderer, controls, matrix;


var status = false;
var animation;
var start;


function play(anim){
	status = true;
	animation = anim;
	start = performance.now();
	animate();
}

function change(x,y, bool){
	matrix[y][x].traverse ( 
		function (child) {
			child.visible = bool;			
		} 
	);
}

function disp_frame(x,y){
	
	for(i=0; i<13; ++i){
		for(j=0; j<16; ++j){	
			matrix[i][j].traverse ( 
				function (child) {
					child.visible = false;			
				} 
			);	
		}
	}	
	for(i=0; i<y.length && i<x.length; ++i){
		var a = 12 - y[i]; var b = x[i];		
		matrix[a][b].traverse ( 
			function (child) {
				child.visible = true;			
			} 
		);		
	}
}
	
function init() {
	
	container = document.getElementById( 'container' );
	window.addEventListener( 'resize', onWindowResize, false );
		
	w = 16; 	h = 13;
	hg = 0.3;	vg = 1.2;
	cx = (w-1 + (w-1)*hg) / 2.0;
	cy = (h-1 + (h-1)*vg) / 2.0;
	
	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 300 );
	
	//controls
	controls = new THREE.OrbitControls(camera);
	camera.position.set(cx, cy, 50);
	controls.target.set(cx, cy, 0)
	controls.maxDistance = 200;
	controls.minDistance = 10;
	controls.enablePan = false;
	controls.update();
	
	//scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x101010 );	
	matrix = createCubes(h, w, hg, vg);
	
	//lights
	var light = new THREE.AmbientLight( 0x404040 );				
	scene.add(light);	
	light = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light.target.position.set(0,0,0);
	light.position.set(2,3,2);
	scene.add(light);
	
	//renderer
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	container.appendChild( stats.dom );
}

function createCubes(h,w,hgap,vgap){
	var lol = new Array(h); //list of lists
	
	var geom =	new THREE.BoxGeometry( 1, 1, 1 );
	var mat = new THREE.MeshLambertMaterial({color: 0x0909F0});
	var cube = new THREE.Mesh( geom, mat );
	for(i=0; i<h; ++i){
		lol[i] = new Array(w);
		for(j=0; j<w; ++j){
			var copy = cube.clone();
			var x = j + j*hgap; // horizontal gap
			var y = i + i*vgap  // vertical gap
			copy.position.set(x, y, 0);
			scene.add(copy);
			lol[i][j] = copy;
		}
	}	
	return lol;
}

function perform(){
	var elapsed_time = performance.now() - start;
	var frame = Math.floor(animation.framerate * elapsed_time/1000);
	
	if(frame >= animation.data.length){
		status = false;
	}else{
		disp_frame(animation.data[frame].x, animation.data[frame].y);
	}
}

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	
	if(status){
		perform();
	}
	renderer.render( scene, camera );
	
	stats.update();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}