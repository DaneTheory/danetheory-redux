var container, stats;
        var camera, scene, renderer;
        var mouseX = 0;
        var mouseY = 0;
        var texture, material, mesh;
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
        var loader;
        var parameters = {
            width: 2000,
            height: 2000,
            widthSegments: 850,
            heightSegments: 850,
            depth: 1500,
            param: 5,
            filterparam: 4
			         };
        // create a scene
        var scene = new THREE.Scene();
		if( !init() )	animate();

		// init the scene
		function init(){
            
			if( Detector.webgl ){
				renderer = new THREE.WebGLRenderer({
					antialias		: true,	// to get smoother output
					preserveDrawingBuffer	: true	// to allow screenshot
				});
				renderer.setClearColor( 0xbbbbbb );
			}else{
				renderer	= new THREE.CanvasRenderer();
			}
			renderer.setSize( window.innerWidth, window.innerHeight );
           // light.castShadow = true;
           // light.shadowDarkness = 0.5;
			document.getElementById('container').appendChild(renderer.domElement);
            //container = document.createElement( 'div' );
	        //document.body.appendChild( container );
            

			// put a camera in the scene
			camera	= new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 10000 );
			// Camera looks toward negative z with y up
            camera.position.set(90, 0, 40);
			scene.add(camera);
            camera.lookAt( camera.position );
           
            

			// create a camera contol
			cameraControls	= new THREEx.DragPanControls(camera, renderer.domElement);
			
			scene.fog=new THREE.Fog( 0xeef0f0, -250, 525 );
            
            //scene.fog=new THREE.FogExp2( 0xEFEFEF, .0055 );
          

    

   
            

			// transparently support window resize
			THREEx.WindowResize.bind(renderer, camera);
			// allow 'p' to make screenshot
			THREEx.Screenshot.bindKey(renderer);
			// allow 'f' to go fullscreen where this feature is supported
			if( THREEx.FullScreen.available() ){
				THREEx.FullScreen.bindKey();		
			}

			// here you add your objects
			// - you will most likely replace this part by your own
			//add sunlight 
            var light = new THREE.SpotLight( 0xFFFFFF ); 
            light.position.set(0,800,0); 
            scene.add(light);
            light.castShadow = true;
            
            var treeLight = new THREE.SpotLight(0xeef0f0); 
            treeLight.position.set(20,-10,30); 
            scene.add(treeLight);
            treeLight.castShadow = true;
            
            var ambientLight = new THREE.AmbientLight( 0x2f3030 );
            scene.add(ambientLight);
            ambientLight.castShadow = true;
            
   
			
		
			
	
			
	
			
			var loader = new THREE.OBJLoader( );
        
                loader.load( './models/tree.obj', function ( object )            
                {
                   object.position.x=(-15);
			       object.position.y=(-10.5);
                   object.position.z=(-40);
                  
                   camera.lookAt( object.position.x );
                   
                   object.castShadow = true;
                   object.receiveShadow = true;
                   scene.add( object );
                });
			
			
		
		
		    //SkyBox
		   var imagePrefix = "../images/skybox/";
	        var directions  = ["posx", "negx", "posy", "negy", "posz", "negz"];
	        var imageSuffix = ".png";
	        var skyGeometry = new THREE.CubeGeometry( 500, 500, 500 );	
	
	        var materialArray = [];
	        for (var i = 0; i < 6; i++)
		        materialArray.push( new THREE.MeshBasicMaterial({
			        map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			        side: THREE.BackSide
	        	}));
	        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	        scene.add( skyBox );
	        
	        //add ground 
           
            
            var groundMat = new THREE.MeshPhongMaterial({color: "rgb(219, 219, 219)"}); 
           
            var groundGeo = new THREE.PlaneGeometry(800,800); 
            
            var ground = new THREE.Mesh(groundGeo,groundMat);
            
            ground.position.y = -15; //lower it 
            ground.rotation.x = -Math.PI/2; //-90 degrees around the xaxis 
            //IMPORTANT, draw on both sides 
            ground.doubleSided = true;
            scene.add(ground);
            ground.receiveShadow = true;
            

            //Particles

		  
		  }
		  
    

		// animation loop
		function animate() {

			// loop on request animation loop
			// - it has to be at the begining of the function
			// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
			requestAnimationFrame( animate );
			

			// do the render
			render();
			update.camera();
			 
			

		}

		// render the scene
		function render() {
			// variable which is increase by Math.PI every seconds - usefull for animation
			var PIseconds	= Date.now() * Math.PI;

			// update camera controls
			cameraControls.update();
			camera.position.copy( camera.position );

            if ( camera.position.y < 0 ) camera.position.y = 0;
            
            camera.position.copy( camera.position );

            if ( camera.position.y >= 10 ) camera.position.y = 10;


			// animation of all objects
			//scene.traverse(function(object3d, i){
				//if( object3d instanceof THREE.Mesh === false )	return
				//object3d.rotation.y = PIseconds*0.0003 * (i % 2 ? 1 : -1);
				//object3d.rotation.x = PIseconds*0.0002 * (i % 2 ? 1 : -1);
			//})
			// animate PointLights
			scene.traverse(function(object3d, idx){
				if( object3d instanceof THREE.PointLight === false )	return
				var angle	= 0.0005 * PIseconds * (idx % 2 ? 1 : -1) + idx * Math.PI/3;
				object3d.position.set(Math.cos(angle)*3, Math.sin(angle*3)*2, Math.cos(angle*2)).normalize().multiplyScalar(2);
			})

			// actually render the scene
			
        
			renderer.shadowMapEnabled = true;
			renderer.shadowMapType = THREE.PCFSoftShadowMap;
			renderer.render( scene, camera );
		};