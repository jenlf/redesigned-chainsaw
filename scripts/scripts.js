/*
* TITLE:        Learn Creative Coding: Particle Systems, Particle Effects Masterclass
* AUTHOR:       Franks laboratory, @Frankslaboratory [YouTube]
* DATE:         May 3 2023
* AVAILABILITY: https://www.youtube.com/playlist?list=PLYElE_rzEw_tLmWtIkUfI6Odi38ajFI8R
*               
*               The following code was adapted from a masterclass series of videos from Franks Laboratory YouTube channel. 
*               Visit the channel here: https://www.youtube.com/@Frankslaboratory to view the original source code and 
*               tutorials. 
*/ 

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gradient = ctx.createLinearGradient(0,0,0, canvas.height);
    gradient.addColorStop(0, 'black'); 
    gradient.addColorStop(0.5, 'black');
    gradient.addColorStop(1, 'grey');
    ctx.fillStyle = gradient; 
    ctx.strokeStyle = 'black'; 

    //create the particles
    class Particle {
        constructor(effect){
            this.effect = effect;
            this.radius = Math.floor(Math.random() * 7 + 1);
            this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
            this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
            this.vx = Math.random() * 1 - 0.5;
            this.vy = Math.random() * 1 - 0.5;
            this.pushX = 0;
            this.pushY = 0;
            this.friction = 0.95;
            this.width = this.radius * 2;
            this.height = this.radius * 2;

            for (let j = 0; j < effect.elementsArray.length; j++) {
                if (this.x - this.radius <= this.effect.elementsArray[j].element.x + this.effect.elementsArray[j].element.width &&
                    this.x - this.radius + this.width >= this.effect.elementsArray[j].element.x &&
                    this.y - this.radius <= this.effect.elementsArray[j].element.y + this.effect.elementsArray[j].element.height && 
                    this.height + this.y - this.radius >= this.effect.elementsArray[j].element.y){
                        //collision detected
                        
                        this.y = this.effect.elementsArray[j].element.y - this.radius;
                        this.x = this.effect.elementsArray[j].element.x - this.radius;
                    }
                }
        }

        draw(context){
            if (this.x - this.radius === 0 && this.y - this.radius === 0){
                this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
                this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
                return;
            }
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();
        }

        //define particle motion and behaviour
        update(){
            if (this.effect.scrolling){
                for (let i = 0; i < effect.elementsArray.length; i++){
                    let dx = this.x - (this.effect.elementsArray[i].x + this.effect.elementsArray[i].element.width/2);
                    let dy = this.y - (this.effect.elementsArray[i].y + this.effect.elementsArray[i].element.height/2);
                    let distance = Math.hypot(dx, dy);
                    let force = this.effect.elementsArray[i].radius / distance;

                    if (distance < this.effect.elementsArray[i].radius){
                        let angle = Math.atan2(dy, dx);
                        //push in correct direction by increasing by sin and cos 
                        this.pushX += Math.cos(angle) * force;
                        this.pushY += Math.sin(angle) * force;
                    }
                }
                
            }

            this.x += (this.pushX *= this.friction) + this.vx;
            this.y += (this.pushY *= this.friction) + this.vy;

            if (this.x < this.radius){
                this.x = this.radius;
                this.vx *= -1;
            } else if (this.x > this.effect.width - this.radius) {
                this.x = this.effect.width - this.radius;
                this.vx *= -1;
            }

            if (this.y < this.radius){
                this.y = this.radius;
                this.vy *= -1;
            } else if (this.y > this.effect.height - this.radius) {
                this.y = this.effect.height - this.radius;
                this.vy *= -1;
            }

            //collision detection again
            for (let j = 0; j < effect.elementsArray.length; j++) {
                if (this.x - this.radius <= this.effect.elementsArray[j].element.x + this.effect.elementsArray[j].element.width &&
                    this.x - this.radius + this.width >= this.effect.elementsArray[j].element.x &&
                    this.y - this.radius <= this.effect.elementsArray[j].element.y + this.effect.elementsArray[j].element.height && 
                    this.height + this.y - this.radius >= this.effect.elementsArray[j].element.y){
                        //collision detected
                        this.vy *= -1;
                        this.vx *= -1;
                    } 
            }

        }

        reset(){
            this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2); 
            this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);

            for (let j = 0; j < effect.elementsArray.length; j++) {
                if (this.x - this.radius <= this.effect.elementsArray[j].element.x + this.effect.elementsArray[j].element.width &&
                    this.x - this.radius + this.width >= this.effect.elementsArray[j].element.x &&
                    this.y - this.radius <= this.effect.elementsArray[j].element.y + this.effect.elementsArray[j].element.height && 
                    this.height + this.y - this.radius >= this.effect.elementsArray[j].element.y){
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
                    element: document.getElementById('navbar').getBoundingClientRect(),
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

            this.particles = [];
            if(canvas.width < 800){
                this.numberOfParticles = 20;

            } else {
                this.numberOfParticles = 50;
            }
            
            this.createParticles();

            window.addEventListener('resize', e => {
                this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
            });

            window.addEventListener('scroll', e => {
                this.elementsArray[0].element = document.getElementById('navbar').getBoundingClientRect();
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

        createParticles(){
            for (let i = 0; i < this.numberOfParticles; i++)
            {
                this.particles.push(new Particle(this));
            }
        }

        handleParticles(context){
            this.connectParticles(context);
            this.particles.forEach(particle => {
                particle.draw(context);
                particle.update();
            });
        }

        connectParticles(context){
            const maxDistance = 80;

            for (let a = 0; a < this.particles.length; a++){
                for (let b = a;b < this.particles.length; b++){
                    //calc distance between two points -- using pythag theorem
                    const dx = this.particles[a].x - this.particles[b].x;
                    const dy = this.particles[a].y - this.particles[b].y;
                    const distance = Math.hypot(dx, dy);
                    if (distance < maxDistance){
                        context.save();
                        const opacity = 1 - (distance/maxDistance);
                        context.globalAlpha = opacity;
                        context.beginPath();
                        context.moveTo(this.particles[a].x, this.particles[a].y);
                        context.lineTo(this.particles[b].x, this.particles[b].y);
                        context.stroke();
                        context.restore();
                    }
                }
            }
        }

        resize(width, height){
            this.canvas.width = width;
            this.canvas.height = height;
            this.width = width;
            this.height = height;
            this.elementsArray[0].element = document.getElementById('navbar').getBoundingClientRect();
            this.elementsArray[1].element = document.getElementById('headline').getBoundingClientRect();
            this.elementsArray[2].element = document.getElementById('topfold-text').getBoundingClientRect();
            this.elementsArray[3].element = document.getElementById('headline-me').getBoundingClientRect();
            this.elementsArray[4].element = document.getElementById('mid-text').getBoundingClientRect();
            this.elementsArray[5].element = document.getElementById('selfie').getBoundingClientRect();
            this.elementsArray[6].element = document.getElementById('headline-thanks').getBoundingClientRect();
            this.elementsArray[7].element = document.getElementById('footer-text').getBoundingClientRect();
            this.elementsArray[8].element = document.getElementById('social').getBoundingClientRect();
            const gradient = this.context.createLinearGradient(0,0,width,height);
            gradient.addColorStop(0, 'black');
            gradient.addColorStop(0.5, 'black');
            gradient.addColorStop(1, 'grey');
            this.context.fillStyle = gradient; 
            this.context.strokeStyle = 'black';

            //reset the particles 
            this.particles.forEach(particle => {
                particle.reset();
            });
        }
    }

    const effect = new Effect(canvas, ctx);

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
    hiddenSections.forEach((el) => observer.observe(el));
}); 