let kMax;
let step;
let n = 150; // number of blobs
let radius = 20; // diameter of the circle
let inter = 1; // difference between the sizes of two blobs
let maxNoise = 300;
let xoff = 0.0;
let yoff = 0.0; 
let inc = 0.001;
let size_factor = 0.1;
let tilt_factor = 0.8;
let movement=0.0003;
let noiseProg = (x) => (x);
let vel = 0.004;
let vel_x = 0.000;
let vel_y = 0.000;
let center_x = 250;
let center_y = 250;
let index = 0;
let frame = 0;
let should_save = true;
let save_every = 10;

let colors = [
  [[255, 0, 0], [0, 255, 0], [0, 0, 255]], //rainbow --
  [[255, 0, 0], [0, 255, 0], [255, 89, 143]], //rainbow - summer
  [[21, 178, 211], [0, 255, 0], [255, 89, 143]],  // summer - rainbow
  [[21, 178, 211], [255, 215, 0], [255, 89, 143]],  // summer --
  [[255, 241, 166], [255, 215, 0], [158, 231, 245]],  //spring - summer
  [[255, 241, 166], [160, 249, 165], [158, 231, 245]],  //spring --
  [[255, 241, 166], [179, 218, 241], [132, 165, 184]], //winter -- spinrt
  [[203, 203, 203], [179, 218, 241], [132, 165, 184]], //winter -- 
  [[243, 188, 46], [212, 91, 18], [156, 39, 6]],  // autumn
  [[243, 188, 46], [212, 91, 18], [156, 39, 6]],  // autumn
  [[255, 0, 0], [0, 255, 0], [0, 0, 255]],
  [[21, 178, 211], [255, 215, 0], [255, 89, 143]],  // summer
  [[255, 0, 0], [0, 255, 0], [0, 0, 255]],
  [[21, 178, 211], [255, 215, 0], [255, 89, 143]],  // summer
  [[255, 0, 0], [0, 255, 0], [0, 0, 255]],
  [[255, 0, 0], [0, 255, 0], [0, 0, 255]],

];

function setup() {
  createCanvas(1000, 1000);
  //colorMode(HSB, 1);
  angleMode(DEGREES);
  noFill();
  //noLoop();
  kMax = random(0.6, 1.0);
  step = 0.01;
  noStroke();
}

function draw() {
  index += 1;
  blendMode(BLEND);
  background(0);
  blendMode(ADD);
  
  xoff += inc;
  yoff += inc;
  
  let t = frameCount/150;
  for (let i = n; i > 0; i--) {
    let alpha = pow(1 - noiseProg(i / n), 4);
    let size = (radius + i * inter) * size_factor;
    let k = kMax * sqrt(i/n);
    //let noisiness = maxNoise * noiseProg(i / n);
    let shift_x = ((noise(xoff, yoff) * 2) - 1) * movement;
    let shift_y = ((noise(xoff, yoff) * 2) - 1) * movement;
    vel_x += shift_x;
    vel_y += shift_y;
    if (vel_x > vel){
      vel_x = vel;
    } else if (vel_x < -vel){
      vel_x = -vel;
    }
    if (vel_y > vel){
      vel_y = vel;
    } else if (vel_y < -vel){
      vel_y = -vel;
    }
    
    center_x += vel_x;
    center_y += vel_y;
    if (center_x > width){
      center_x -= width;
    } else if (center_x < 0){
      center_x += width;
    }
    if (center_y > height){
      center_y -= height;
    } else if (center_y < 0){
      center_y += height;
    }
    
    
    let tilt_x = ((noise(xoff, yoff) * 2) - 1) * tilt_factor + 1;
    let tilt_y = ((noise(xoff, yoff) * 2) - 1) * tilt_factor + 1;
    let noisiness = noiseProg(i/n) * maxNoise;
    let relative_pos_x = center_x / width;
    let relative_pos_y = center_y / height;
    let color_index = int(noise(relative_pos_x, relative_pos_y) * 10);
    let color_gamut = colors[color_index];
    let c1 = color_gamut[0];
    let c2 = color_gamut[1];
    let c3 = color_gamut[2];
    
    fill(c1[0], c1[1], c1[2], alpha*255);
    blob(size, center_x, center_y, k, t - i * step, noisiness, tilt_x, tilt_y);
    
    fill(c2[0], c2[1], c2[2], alpha*255);
    blob(size, center_x, center_y, k, t - i * step + 0.2, noisiness, tilt_x, tilt_y);
    
    fill(c3[0], c3[1], c3[2], alpha*255);
    blob(size, center_x, center_y, k, t - i * step + 0.4, noisiness, tilt_x, tilt_y);
  }
  
  if (should_save && (index % save_every == 0)){
    let fname = '/Users/shimon/Documents/Processing/sketch_220531a/img1_' + nf(frame, 5);
    saveCanvas(fname, 'jpg');
    frame += 1;
  }
}

function blob(size, xCenter, yCenter, k, t, noisiness, tilt_x, tilt_y) {
  beginShape();
  let angleStep = 360 / 10;
  for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
    let r1, r2;
    
    r1 = cos(theta)+1;
    r2 = sin(theta)+1;
    let r = size + noise(k * r1,  k * r2, t) * noisiness;
    let x = xCenter + (r * cos(theta)) * tilt_x;
    let y = yCenter + (r * sin(theta)) * tilt_y;
    curveVertex(x, y);
  }
  endShape();
}
