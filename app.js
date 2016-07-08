var sun = new Image();
var moon = new Image();
var earth = new Image();
var marte = new Image();
var mercurio = new Image();

function init(){
  sun.src = 'Canvas_sun.png';
  moon.src = 'Canvas_moon.png';
  earth.src = 'Canvas_earth.png';
  mercurio.src = 'mercurio.png';
  marte.src = 'marte.png';
  window.requestAnimationFrame(draw);
}


function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');

  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0,0,600,600); // clear canvas

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.save();
  ctx.translate(300,300);

  // Earth
  var time = new Date();
  ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
  ctx.translate(150,0);
  ctx.fillRect(0,-12,50,24); // Shadow
  ctx.drawImage(earth,-12,-12);

  // Moon
  ctx.save();
  ctx.rotate( ((2*Math.PI)/6)*time.getSeconds() + ((2*Math.PI)/6000)*time.getMilliseconds() );
  ctx.translate(0,28.5);
  ctx.drawImage(moon,-3.5,-3.5);
  ctx.restore();

  ctx.restore();
  
  ctx.beginPath();
  ctx.arc(300,300,150,0,Math.PI*2,false); // Earth orbit
  ctx.stroke();

  // Mars
  ctx.save();
  ctx.translate(300,300);
  ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
  ctx.translate(130,130);
  ctx.drawImage(marte,-8,-8, 40 ,40);
  
  ctx.restore();



  ctx.beginPath();
  ctx.arc(300,300,200,0,Math.PI*2,false); // Mars orbit
  ctx.stroke();



  // Mercurio
  ctx.save();
  ctx.translate(300,300);
  ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
  ctx.translate(60,60);
  ctx.drawImage(mercurio,-6,-6, 30 ,30);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(300,300,100,0,Math.PI*2,false); // Mars orbit
  ctx.stroke();
  
 
  ctx.drawImage(sun,0,0,600,600);

  window.requestAnimationFrame(draw);
}

init();