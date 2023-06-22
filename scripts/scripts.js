window.addEventListener('load', function(){
    //setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d'); //gets CanvasRenderingContext2D for drawing surface
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //create a gradient for particles - upper eft to ower right
    const gradient = ctx.createLinearGradient(0,0,0, canvas.height);
    gradient.addColorStop(0, 'black'); //adding gradient points
    gradient.addColorStop(0.5, 'black');
    gradient.addColorStop(1, 'grey');
    ctx.fillStyle = gradient; 
    ctx.strokeStyle = 'black'; //set stroke for line connection since default is black

    //create the particles
    class Particle {
        constructor(effect){
            this.effect = effect;
            this.radius = Math.floor(Math.random() * 7 + 1); //using math floor makes nice integers
            this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2); //to keep them from going outside of the screen
            //this.x = this.effect.elementsArray[1].x + this.effect.elementsArray[1].element.width * 1.5;
            //console.log(this.effect.elementsArray[1].width);
            this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
            //this.y = -this.radius - Math.random() * this.effect.height * 0.7;
            this.vx = Math.random() * 1 - 0.5; //random speeds between values
            this.vy = Math.random() * 1 - 0.5;
            this.pushX = 0; //used for speed particles move closer/further from mouse
            this.pushY = 0;
            //adjusting friction num will adjust speed, must be less than 1
            this.friction = 0.95; //this is an opposing force that will slow down the push
            this.width = this.radius * 2;
            this.height = this.radius * 2;
            this.isCollided = [false, false, false, false, false, false, false, false];

            for (let j = 0; j < effect.elementsArray.length; j++) {
                if (this.x - this.radius < this.effect.elementsArray[j].element.x + this.effect.elementsArray[j].element.width &&
                    this.x - this.radius + this.width > this.effect.elementsArray[j].element.x &&
                    this.y - this.radius < this.effect.elementsArray[j].element.y + this.effect.elementsArray[j].element.height && 
                    this.height + this.y - this.radius > this.effect.elementsArray[j].element.y){
                        //collision detected
                        
                        this.y = this.effect.elementsArray[j].element.y - this.radius;
                        this.x = this.effect.elementsArray[j].element.x - this.radius;
                        
                    }
                }
        }

        draw(context){
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2); //make a circle
            //need to fill or outline w stroke
            context.fill();
            //draw rect for particles in debug mode so we can see what is happening
            // if (this.effect.debug){
            //     context.strokeRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); //this aligns the boxes correctly over circles
            // }
        }

        //define particle motion and behaviour
        update(){
            if (this.effect.scrolling){
                for (let i = 0; i < effect.elementsArray.length; i++){
                    //calc distance between particle & mouse also using pythag theorem
                    let dx = this.x - (this.effect.elementsArray[i].x + this.effect.elementsArray[i].element.width/2);
                    let dy = this.y - (this.effect.elementsArray[i].y + this.effect.elementsArray[i].element.height/2);
                    let distance = Math.hypot(dx, dy);
                    //set particles to move fast inside mouse rasius, slower outside
                    let force = this.effect.elementsArray[i].radius / distance;
                    //if less than mouse radius calc angle between to know which way to push particle
                    if (distance < this.effect.elementsArray[i].radius){
                        //atan2 gives coutnerclock angle 
                        let angle = Math.atan2(dy, dx);
                        //push in correct direction by increasing by sin and cos 
                        this.pushX += Math.cos(angle) * force;
                        this.pushY += Math.sin(angle) * force;
                    }
                }
                
            }

            //adding the friction reduces the push by 5% per ea animation frame
            //bounce force will then take effect again
            //order matters - moving this code up ensures we can't push particles out of canvas
            this.x += (this.pushX *= this.friction) + this.vx;
            this.y += (this.pushY *= this.friction) + this.vy;

            //if horizontal position is less than radius (touching left) cannot go furhter left, then it's set back and vx is flipped
            if (this.x < this.radius){
                this.x = this.radius;
                this.vx *= -1;
            } else if (this.x > this.effect.width - this.radius) {
                this.x = this.effect.width - this.radius;
                this.vx *= -1;
            }
            //then same for height
            if (this.y < this.radius){
                this.y = this.radius;
                this.vy *= -1;
            } else if (this.y > this.effect.height - this.radius) {
                this.y = this.effect.height - this.radius;
                this.vy *= -1;
            }

            //collision detection -- use the element properties not obj properties for initial detection
            for (let j = 0; j < effect.elementsArray.length; j++) {
                if (this.x - this.radius < this.effect.elementsArray[j].element.x + this.effect.elementsArray[j].element.width &&
                    this.x - this.radius + this.width > this.effect.elementsArray[j].element.x &&
                    this.y - this.radius < this.effect.elementsArray[j].element.y + this.effect.elementsArray[j].element.height && 
                    this.height + this.y - this.radius > this.effect.elementsArray[j].element.y){
                        //collision detected
                        this.vy *= -1;
                        this.vx *= -1;
                    } 
            }

        }

        //this method resets the position of the particles if window is resized
        //this ensures that if it is smaller we dont lose particles
        reset(){
            this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2); //to keep them from going outside of the screen
            this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
            //checks for collision on page resize and resets the particles if they are under and element
            for (let j = 0; j < effect.elementsArray.length; j++) {
                if (this.x - this.radius < this.effect.elementsArray[j].element.x + this.effect.elementsArray[j].element.width &&
                    this.x - this.radius + this.width > this.effect.elementsArray[j].element.x &&
                    this.y - this.radius < this.effect.elementsArray[j].element.y + this.effect.elementsArray[j].element.height && 
                    this.height + this.y - this.radius > this.effect.elementsArray[j].element.y){
                        //collision detected
                        this.y = this.effect.elementsArray[j].element.y - this.radius;
                        this.x = this.effect.elementsArray[j].element.x - this.radius;
                    }
            }
        }
    }

    //handle all effects on the particles
    class Effect {
        constructor(canvas, context){
            this.canvas = canvas;
            this.context = context;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        
            this.debug = false;
            this.scrolling = false;
            this.initialLoad = true;

            this.elementsArray = [
                {
                    element: document.getElementById('logo').getBoundingClientRect(),
                    x: 0,
                    y: 0,
                    radius: 200,
                },
                {
                    element: document.getElementById('headline').getBoundingClientRect(),
                    x: 0,
                    y: 0,
                    radius: 500,
                },
                {
                    element: document.getElementById('topfold-text').getBoundingClientRect(),
                    x: 0,
                    y: 0,
                    radius: 500,
                },
                {
                    element: document.getElementById('headline-me').getBoundingClientRect(),
                    x: 0,
                    y: 0,
                    radius: 300,
                },
                {
                    element: document.getElementById('mid-text').getBoundingClientRect(),
                    x: 0,
                    y: 0,
                    radius: 500,
                },
                {
                    element: document.getElementById('selfie').getBoundingClientRect(),
                    x: 0,
                    y: 0,
                    radius: 300,
                },
                {
                    element: document.getElementById('headline-thanks').getBoundingClientRect(),
                    x: 0,
                    y: 0,
                    radius: 300,
                },
                {
                    element: document.getElementById('footer-text').getBoundingClientRect(),
                    x: 0,
                    y: 0,
                    radius: 500,
                },
                {
                    element: document.getElementById('social').getBoundingClientRect(),
                    x: 0,
                    y: 0,
                    radius: 200,
                }
            ];
            console.log(this.elementsArray);
            this.particles = [];
            this.numberOfParticles = 100;
            this.createParticles(); //creates the particles when Effect is instantiated

            window.addEventListener('keydown', e => {
                if (e.key === 'd'){
                    this.debug = !this.debug; //switch to opposite
                }
            })

            //this adds the listener for when the user resizes the window
            //event for resizing, e will point back to effect obj
            window.addEventListener('resize', e => {
                this.resize(e.target.window.innerWidth, e.target.window.innerHeight); //pass the window width and height to resize func
            });

            window.addEventListener('scroll', e => {
                this.elementsArray[0].element = document.getElementById('logo').getBoundingClientRect();
                this.elementsArray[1].element = document.getElementById('headline').getBoundingClientRect();
                this.elementsArray[2].element = document.getElementById('topfold-text').getBoundingClientRect();
                this.elementsArray[3].element = document.getElementById('headline-me').getBoundingClientRect();
                this.elementsArray[4].element = document.getElementById('mid-text').getBoundingClientRect();
                this.elementsArray[5].element = document.getElementById('selfie').getBoundingClientRect();
                this.elementsArray[6].element = document.getElementById('headline-thanks').getBoundingClientRect();
                this.elementsArray[7].element = document.getElementById('footer-text').getBoundingClientRect();
                this.elementsArray[8].element = document.getElementById('social').getBoundingClientRect();

                this.scrolling = true;
                for(let i = 0; i < effect.elementsArray.length; i++) {
                    this.elementsArray[i].x = this.elementsArray[i].element.left;
                    this.elementsArray[i].y = this.elementsArray[i].element.top;
                }
            });

            window.addEventListener('scrollend', e => {
                this.scrolling = false;
            });
        }

        //runs once to init effect & create particle objs
        createParticles(){
            for (let i = 0; i < this.numberOfParticles; i++)
            {
                this.particles.push(new Particle(this)); //passing this to Particle since construct takes an Effect Obj
            }
        }

        //passing context since ea particle needs to know what context to draw on
        handleParticles(context){
            this.connectParticles(context); //lines drawn first here so that particles sit on top since we are drawing on single canvas
            this.particles.forEach(particle => {
                particle.draw(context);
                particle.update();
            });
            //debug function shows lines around DOM rect on element
            if (this.debug){
                context.strokeRect(this.element1.x, this.element1.y, this.element1.width, this.element1.height);
            }
        }

        connectParticles(context){
            const maxDistance = 80; //only connecting particles that are 100px apart
            //compare every particle in array to calc distance between using nested for loops
            for (let a = 0; a < this.particles.length; a++){
                for (let b = a;b < this.particles.length; b++){
                    //calc distance between two points -- using pythag theorem
                    const dx = this.particles[a].x - this.particles[b].x;
                    const dy = this.particles[a].y - this.particles[b].y;
                    const distance = Math.hypot(dx, dy); //gives hypotenuse
                    if (distance < maxDistance){
                        context.save(); //saves all canvas settings prior to next line execution, needed since we set globalAlpha
                        //setting line opacity to fade out as paricles move apart
                        // 1 - the ratio flips it so the opacity is darker as the particles are closer
                        const opacity = 1 - (distance/maxDistance);
                        context.globalAlpha = opacity; //sets the opacity globally to all shapes so need to save & restore
                        context.beginPath();
                        context.moveTo(this.particles[a].x, this.particles[a].y);
                        context.lineTo(this.particles[b].x, this.particles[b].y);
                        //actually draw it
                        context.stroke();
                        context.restore(); //restores saved canvas settings from above
                    }
                }
            }
        }

        //make the canvas responsive to window size changes, context passed because particles must also be redrawn ea time
        resize(width, height){
            this.canvas.width = width;
            this.canvas.height = height;
            this.width = width;
            this.height = height;
            //this first html element on the page to collide with
            this.elementsArray[0].element = document.getElementById('logo').getBoundingClientRect();
            this.elementsArray[1].element = document.getElementById('headline').getBoundingClientRect();
            this.elementsArray[2].element = document.getElementById('topfold-text').getBoundingClientRect();
            this.elementsArray[3].element = document.getElementById('headline-me').getBoundingClientRect();
            this.elementsArray[4].element = document.getElementById('mid-text').getBoundingClientRect();
            this.elementsArray[5].element = document.getElementById('selfie').getBoundingClientRect();
            this.elementsArray[6].element = document.getElementById('headline-thanks').getBoundingClientRect();
            this.elementsArray[7].element = document.getElementById('footer-text').getBoundingClientRect();
            this.elementsArray[8].element = document.getElementById('social').getBoundingClientRect();
            //recalc gradient for particles - upper eft to ower right AFTER window resize
            const gradient = this.context.createLinearGradient(0,0,width,height);
            gradient.addColorStop(0, 'black'); //adding gradient points
            gradient.addColorStop(0.5, 'black');
            gradient.addColorStop(1, 'grey');
            this.context.fillStyle = gradient; 
            this.context.strokeStyle = 'black'; //set stroke for line connection since default is black

            //reset the particles 
            this.particles.forEach(particle => {
                particle.reset();
            });
        }
    }

    const effect = new Effect(canvas, ctx); //keeps the classes contained by passing in the canvas

    //animate, update & redraw
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear out old paint
        effect.handleParticles(ctx);
        requestAnimationFrame(animate);
    }
    animate();


    const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) 
        {
        entry.target.classList.add('show');
        }
        else
        {
        entry.target.classList.remove('show');
        }
    });
    });

    const hiddenSections = document.querySelectorAll('.scroll-section');
    //tell the observer what to observe
    hiddenSections.forEach((el) => observer.observe(el));
}); 