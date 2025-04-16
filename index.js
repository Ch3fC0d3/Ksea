// Default parameter values
let numFish = 12;
let numBubbles = 15;
let backgroundVisibility = 5;

// Initialize parameters after p5.js is loaded
window.$fx = {
  _params: {},
  params: function(defs) {
    this.definitions = defs;
    defs.forEach(def => {
      if (def.type === "number") {
        this._params[def.id] = (def.options.min + def.options.max) / 2;
      }
    });
    // Update variables with parameter values
    numFish = this._params["num_fish"];
    numBubbles = this._params["num_bubbles"];
    backgroundVisibility = this._params["background_visibility"];
  },
  getParam: function(id) {
    return this._params[id];
  },
  definitions: []
};

// Set up parameters
window.$fx.params([
  {
    id: "num_fish",
    name: "Number of Fish",
    type: "number",
    options: {
      min: 5,
      max: 20,
      step: 1
    }
  },
  {
    id: "num_bubbles",
    name: "Number of Bubbles",
    type: "number",
    options: {
      min: 5,
      max: 30,
      step: 1
    }
  },
  {
    id: "background_visibility",
    name: "Background Visibility",
    type: "number",
    options: {
      min: 0,
      max: 9,
      step: 1
    }
  }
]);

let fishes = [];
let bubbles = [];  
let starbursts = [];  
const numStarbursts = 12;  

// Klimt-inspired metallic color palette
const goldColors = [
  '#B8860B',  // Byzantine gold
  '#CFB53B',  // Antique gold
  '#D4AF37',  // Metallic gold
  '#E6BE8A',  // Royal gold
  '#B87333',  // Copper
  '#CD7F32',  // Bronze
  '#996515',  // Deep gold
  '#800020',  // Rich burgundy gold
  '#DAA520',  // Golden rod
  '#8B4513',  // Dark copper
  '#FFD700',  // Pure gold
  '#C19A6B',  // Antique bronze
  '#E6C19C',  // Pale gold
  '#AE8F60',  // Warm gold
  '#D4AF37',  // Gold
  '#9C7C38',  // Antique brass
  '#967117',  // Metallic bronze
  '#6B4423'   // Deep bronze
];

// Klimt pattern colors for accents
const klimtAccentColors = [
  '#000000',  // Deep black for contrast
  '#4A0404',  // Deep burgundy
  '#2C1810',  // Dark brown
  '#1E1E1E',  // Soft black
  '#800020',  // Burgundy
  '#4B0082',  // Indigo
  '#2F4F4F',  // Dark slate
  '#191970'   // Midnight blue
];

// Klimt-inspired mosaic background
let mosaicTiles = [];
const tileSize = 180;  
const tileOverlap = 0.4;  
const numTilesX = Math.ceil(window.innerWidth / (tileSize * (1 - tileOverlap))) + 2;
const numTilesY = Math.ceil(window.innerHeight / (tileSize * (1 - tileOverlap))) + 2;

// Add new arrays for atmospheric effects
let lightRays = [];
let particles = [];
const numRays = 8;
const numParticles = 100;

// Add arrays for new effects
let floatingPatterns = [];
let ripples = [];
let seaweeds = [];  
let corals = [];  
let snails = [];  
const numFloatingPatterns = 15;
const numSeaweeds = 8;  
const numCorals = 12;  
const numSnails = 3;  

// Add arrays for ground elements
let coralFormations = [];
let seaweedClusters = [];
const numCoralFormations = 12;
const numSeaweedClusters = 15;

// Clock-related variables
let hourSnail, minuteSnail, secondSnail;
let seaweedMarkers = [];

// Add celestial body arrays
let celestialBodies = [];
const numCelestialBodies = 2;

class MosaicTile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.pattern = random() < 0.1 ? 0 : floor(random(1, 4));
    // Initial colors will be set by updateBackgroundVisibility()
    this.color = color(0, 0, 0, 0);
    this.accentColor = color(0, 0, 0, 0);
    this.rotation = random(TWO_PI);
    this.size = tileSize * 1.5;  
    this.offset = random(1000);
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    
    // Subtle animation
    let breathe = sin(frameCount * 0.01 + this.offset) * 1.2;
    scale(1 + breathe * 0.01);  
    
    switch(this.pattern) {
      case 0: // Spiral pattern (rare)
        this.drawSpiral();
        break;
      case 1: // Square pattern
        this.drawSquares();
        break;
      case 2: // Circle pattern
        this.drawCircles();
        break;
      case 3: // Triangle pattern
        this.drawTriangles();
        break;
    }
    pop();
  }

  drawSpiral() {
    let steps = 8;  
    let angleStep = TWO_PI / steps;
    let radiusStep = this.size / (3 * steps);  
    
    beginShape();
    for (let i = 0; i <= steps * 4; i++) {
      let angle = i * angleStep;
      let radius = i * radiusStep;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    noFill();
    stroke(this.color);
    strokeWeight(2);  
    endShape();
  }

  drawSquares() {
    noFill();
    stroke(this.color);
    strokeWeight(2);
    for (let i = 3; i > 0; i--) {  
      let size = this.size * i/3;
      rect(-size/2, -size/2, size, size);
    }
    // Larger accent square
    fill(this.accentColor);
    noStroke();
    rect(-this.size/8, -this.size/8, this.size/4, this.size/4);
  }

  drawCircles() {
    for (let i = 4; i > 0; i--) {  
      let size = this.size * i/3;  
      if (i % 2 === 0) {
        fill(this.color);
        noStroke();
      } else {
        noFill();
        stroke(this.accentColor);
        strokeWeight(2);
      }
      circle(0, 0, size);
    }
    // Larger accent dot
    fill(this.accentColor);
    noStroke();
    circle(0, 0, this.size/6);
  }

  drawTriangles() {
    let size = this.size/2;  
    noStroke();
    fill(this.color);
    triangle(0, -size, size*0.866, size/2, -size*0.866, size/2);
    // Larger accent triangle
    fill(this.accentColor);
    let innerSize = size * 0.5;
    triangle(0, -innerSize, innerSize*0.866, innerSize/2, -innerSize*0.866, innerSize/2);
  }
}

class FloatingPattern {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(20, 60);
    this.speedX = random(-0.2, 0.2);
    this.speedY = random(-0.2, 0.2);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.002, 0.002);
    this.patternType = floor(random(4));
    this.opacity = random(40, 80);
    this.color = color(random(goldColors));
    this.accentColor = color(random(klimtAccentColors));
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;

    // Wrap around edges
    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
    if (this.y > height + this.size) this.y = -this.size;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    noStroke();
    
    // Set colors with opacity
    let mainColor = color(red(this.color), green(this.color), blue(this.color), this.opacity);
    let secondColor = color(red(this.accentColor), green(this.accentColor), blue(this.accentColor), this.opacity);
    
    switch(this.patternType) {
      case 0: // Concentric circles
        for(let i = 3; i > 0; i--) {
          fill(i % 2 === 0 ? mainColor : secondColor);
          circle(0, 0, this.size * i/3);
        }
        break;
      case 1: // Square spiral
        fill(mainColor);
        for(let i = 0; i < 4; i++) {
          rotate(PI/2);
          rect(0, 0, this.size/2, this.size/8);
        }
        break;
      case 2: // Triangle pattern
        fill(mainColor);
        for(let i = 0; i < 3; i++) {
          rotate(TWO_PI/3);
          triangle(0, -this.size/2, this.size/4, this.size/4, -this.size/4, this.size/4);
        }
        break;
      case 3: // Klimt-style eye pattern
        fill(mainColor);
        ellipse(0, 0, this.size, this.size * 0.6);
        fill(secondColor);
        circle(0, 0, this.size * 0.3);
        break;
    }
    pop();
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.maxSize = random(30, 50);
    this.opacity = 255;
    this.speed = random(1, 2);
  }

  update() {
    this.size += this.speed;
    this.opacity = map(this.size, 0, this.maxSize, 255, 0);
    return this.size < this.maxSize;
  }

  display() {
    push();
    noFill();
    stroke(255, this.opacity);
    strokeWeight(2);
    circle(this.x, this.y, this.size);
    pop();
  }
}

class Fish {
  constructor(startX, startY, size, noiseSeedX, noiseSeedY, tailSpeed) {
    this.position = createVector(startX, startY);
    this.size = size;
    // Adjust tail speed based on size
    this.tailSpeed = tailSpeed * map(size, 60, 200, 0.5, 0.3); 
    this.tailAngle = 0;
    this.noiseOffsetX = noiseSeedX;
    this.noiseOffsetY = noiseSeedY;
    // Adjust velocity based on size
    this.velocity = p5.Vector.random2D().mult(map(size, 60, 200, 0.3, 0.15)); 
    this.maxSpeed = map(size, 60, 200, 0.4, 0.25); 
    
    // Generate brighter, more visible colors
    let hue = random(360);
    let saturation = random(70, 100);
    let brightness = random(70, 100);  
    colorMode(HSB, 360, 100, 100, 255);
    this.color = color(hue, saturation, brightness);
    colorMode(RGB, 255, 255, 255, 255);
    this.isColored = true;
    
    // Add fin animation offset
    this.finOffset = random(TWO_PI);
    // Adjust fin probability based on size
    this.hasBackDorsalFin = random() < map(size, 60, 200, 0.3, 0.7);  
    this.hasTopDorsalFin = random() < map(size, 60, 200, 0.3, 0.7);
    this.topFinOffset = random(TWO_PI);
    
    // Add Klimt-style decorative patterns
    this.hasSpirals = random() < map(size, 60, 200, 0.3, 0.5);   
    this.hasGoldSpots = random() < map(size, 60, 200, 0.4, 0.6);  
    this.patternColor = color(random(goldColors));
    this.accentColor = color(random(klimtAccentColors));
    this.patternOffset = random(TWO_PI);
    this.spotSize = random(size * 0.05, size * 0.1);  
    
    // Metallic effect properties
    this.metallicShimmerOffset = random(1000);
    this.metallicHighlightColor = color(random(goldColors));
    this.hasMetallicEdge = random() < map(size, 60, 200, 0.5, 0.8);  
    this.metallicEdgeWidth = random(size * 0.03, size * 0.06);  
  }

  update() {
    // More gentle tail movement
    this.tailAngle = sin(frameCount * this.tailSpeed * 0.6) * PI / 8 * (0.8 + noise(frameCount * 0.05) * 0.4);
    
    // More graceful movement using multiple noise fields
    let flowAngle = noise(this.noiseOffsetX, this.noiseOffsetY) * TWO_PI * 2;
    let flowStrength = noise(this.noiseOffsetX + 1000, this.noiseOffsetY + 1000) * 0.035;  
    
    let acceleration = createVector(
      cos(flowAngle) * flowStrength,
      sin(flowAngle) * flowStrength
    );

    // Add collision avoidance
    let separationForce = this.separate();
    acceleration.add(separationForce);
    
    // Apply gentle acceleration
    acceleration.mult(0.25);  
    
    this.velocity.add(acceleration).limit(this.maxSpeed);

    // Create a temporary position to check before actually moving
    let tempPosition = p5.Vector.add(this.position, this.velocity);
    
    // Check if the fish would go below the bottom of the screen
    let bottomMargin = height - 100; 
    if (tempPosition.y > bottomMargin) {
      // Add gentle upward force
      this.velocity.y -= 0.03;  
      // Ensure fish stays above bottom
      tempPosition.y = bottomMargin;
    }
    
    this.position = tempPosition;
    
    // Slightly faster noise offset change for direction changes
    this.noiseOffsetX += 0.002;  
    this.noiseOffsetY += 0.002;  
    
    // Wrap around screen edges with slight fade (except bottom)
    if (this.position.x < -50) this.position.x = width + 50;
    if (this.position.x > width + 50) this.position.x = -50;
    if (this.position.y < -50) this.position.y = height - 100;
  }

  separate() {
    let desiredSeparation = this.size * 3;  
    let sum = createVector(0, 0);
    let count = 0;

    for (let other of fishes) {
      if (other !== this) {
        let d = p5.Vector.dist(this.position, other.position);
        
        if (d < desiredSeparation) {
          let diff = p5.Vector.sub(this.position, other.position);
          diff.normalize();
          // Stronger separation force when very close
          let strength = map(d, 0, desiredSeparation, 1, 0);
          strength = strength * strength;  
          diff.mult(strength);
          sum.add(diff);
          count++;
        }
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(0.15);  
      return steer;
    }
    return createVector(0, 0);
  }

  display() {
    push();
    translate(this.position.x, this.position.y);
    
    // Calculate movement angle but keep fish upright
    let angle = atan2(this.velocity.y, this.velocity.x);
    // Normalize angle to be between -PI and PI
    while (angle < -PI) angle += TWO_PI;
    while (angle > PI) angle -= TWO_PI;
    
    // If moving left, flip the fish
    let flipX = (abs(angle) > PI/2) ? -1 : 1;
    scale(flipX, 1); // Flip based on direction
    // Add subtle glow effect
    let glowColor = color(255, 255, 255, 20);  
    drawingContext.shadowBlur = 15;  
    drawingContext.shadowColor = glowColor;

    // Main body with slightly more organic curve
    push();
    if (this.isColored) {
      // Add slight color variation over time
      let hueShift = noise(frameCount * 0.01 + this.noiseOffsetX) * 20 - 10;
      let col = color(red(this.color) + hueShift, 
                     green(this.color) + hueShift, 
                     blue(this.color) + hueShift,
                     220);  
      fill(col);
    } else {
      noFill();
    }
    stroke(255, 100);  
    strokeWeight(1.5);  

    // Draw the fish body
    beginShape();
    let bodyNoiseOffset = frameCount * 0.02;
    curveVertex(this.size / 2, 0);
    curveVertex(this.size / 2, 0);
    curveVertex(0, -this.size / 4 * (1 + noise(bodyNoiseOffset) * 0.2));
    curveVertex(-this.size / 2, 0);
    curveVertex(0, this.size / 4 * (1 + noise(bodyNoiseOffset + 1) * 0.2));
    curveVertex(this.size / 2, 0);
    curveVertex(this.size / 2, 0);
    endShape();
    pop();

    // Add metallic edge effect if enabled
    if (this.hasMetallicEdge) {
      push();
      blendMode(ADD);
      strokeWeight(this.metallicEdgeWidth);
      let edgeTime = frameCount * 0.02 + this.metallicShimmerOffset;
      let edgeOpacity = map(sin(edgeTime), -1, 1, 100, 200);
      stroke(red(this.metallicHighlightColor), 
             green(this.metallicHighlightColor), 
             blue(this.metallicHighlightColor), 
             edgeOpacity);
      noFill();
      // Draw shimmering edge
      beginShape();
      let edgeNoiseOffset = frameCount * 0.02;
      curveVertex(this.size / 2, 0);
      curveVertex(this.size / 2, 0);
      curveVertex(0, -this.size / 4 * (1 + noise(edgeNoiseOffset) * 0.2));
      curveVertex(-this.size / 2, 0);
      curveVertex(0, this.size / 4 * (1 + noise(edgeNoiseOffset + 1) * 0.2));
      curveVertex(this.size / 2, 0);
      curveVertex(this.size / 2, 0);
      endShape();
      pop();
    }
    
    // Draw single dorsal fin with animation
    let finWave = sin(frameCount * 0.1 + this.finOffset) * 0.2;
    let topFinWave = sin(frameCount * 0.12 + this.topFinOffset) * 0.15; 

    // Top dorsal fin
    if (this.hasTopDorsalFin) {
      push();
      translate(0, -this.size * 0.3); 
      rotate(-PI/2 + topFinWave + PI/18); 
      fill(this.color);
      noStroke();
      // Draw triangle
      beginShape();
      vertex(0, 0);
      vertex(this.size * 0.15, -this.size * 0.2); 
      vertex(-this.size * 0.1, -this.size * 0.15);
      endShape(CLOSE);
      
      // Add stroke only to the edges
      stroke(255, 240);
      strokeWeight(1);
      line(0, 0, this.size * 0.15, -this.size * 0.2);  
      line(this.size * 0.15, -this.size * 0.2, -this.size * 0.1, -this.size * 0.15);  
      pop();
    }

    // Back dorsal fin
    if (this.hasBackDorsalFin) {
      push();
      translate(-this.size * 0.3, -this.size * 0.2);
      rotate(-PI/8 - PI/2 + finWave * 0.6 - PI/12); 
      fill(this.color);
      noStroke();
      // Draw triangle
      beginShape();
      vertex(0, 0);
      vertex(this.size * 0.2, -this.size * 0.12);
      vertex(-this.size * 0.1, -this.size * 0.06);
      endShape(CLOSE);
      
      // Add stroke only to the front and top edges
      stroke(255, 240);
      strokeWeight(1);
      line(0, 0, this.size * 0.2, -this.size * 0.12);  
      line(this.size * 0.2, -this.size * 0.12, -this.size * 0.1, -this.size * 0.06);  
      pop();
    }
    
    if (this.hasStripes) {
      // Draw stripes
      strokeWeight(0.5);
      let stripeSpacing = 8;  
      let stripeAngle = PI / 6; 
      for (let x = 0; x > -this.size / 2 + (stripeSpacing * 3); x -= stripeSpacing) {  
        push();
        translate(x, 0);
        rotate(stripeAngle);
        stroke(255);  
        line(0, -this.size/8, 0, this.size/8);
        pop();
      }
    } else if (this.hasScales) {
      // Add scales texture
      let scaleSize = 15;  
      let y = 0;  
      for (let x = 0; x > -this.size / 4; x -= scaleSize) {
        push();
        translate(x, y);
        noFill();
        strokeWeight(0.5);
        stroke(255);  
        arc(0, 0, scaleSize, scaleSize, PI, TWO_PI);
        pop();
      }
    }
    
    // Add Klimt-inspired decorative patterns
    if (this.hasSpirals) {
      push();
      stroke(this.patternColor);
      strokeWeight(1);
      noFill();
      let spiralTime = frameCount * 0.01 + this.patternOffset;
      for (let i = 0; i < 3; i++) {
        beginShape();
        for (let angle = 0; angle < TWO_PI * 2; angle += 0.2) {
          let radius = (1 + sin(angle + spiralTime)) * this.size * 0.06;
          let x = cos(angle) * radius;
          let y = sin(angle) * radius;
          curveVertex(x, y);
        }
        endShape();
      }
      pop();
    }

    if (this.hasGoldSpots) {
      push();
      noStroke();
      fill(this.patternColor);
      let spotTime = frameCount * 0.02 + this.patternOffset;
      for (let i = 0; i < 5; i++) {
        let spotX = lerp(-this.size * 0.3, this.size * 0.3, i/4);
        let spotY = sin(spotTime + i) * this.size * 0.1;
        circle(spotX, spotY, this.spotSize * (0.8 + sin(spotTime + i * 0.5) * 0.2));
      }
      // Add smaller accent spots
      fill(this.accentColor);
      for (let i = 0; i < 3; i++) {
        let spotX = lerp(-this.size * 0.25, this.size * 0.25, i/2);
        let spotY = cos(spotTime + i) * this.size * 0.08;
        circle(spotX, spotY, this.spotSize * 0.6);
      }
      pop();
    }

    // Enhanced metallic shimmer effects
    if (this.isColored) {
      push();
      blendMode(SCREEN);
      noStroke();
      
      // Primary shimmer
      let shimmerTime = frameCount * 0.03 + this.metallicShimmerOffset;
      for (let i = 0; i < 5; i++) {
        let shimmerOpacity = map(sin(shimmerTime + i), -1, 1, 10, 40);
        fill(red(this.metallicHighlightColor), 
             green(this.metallicHighlightColor), 
             blue(this.metallicHighlightColor), 
             shimmerOpacity);
        
        let x = cos(shimmerTime + i) * this.size * 0.2;
        let y = sin(shimmerTime + i * 0.7) * this.size * 0.1;
        let size = this.size * (0.1 + sin(shimmerTime + i) * 0.05);
        circle(x, y, size);
      }

      // Secondary smaller highlights
      for (let i = 0; i < 8; i++) {
        let microTime = frameCount * 0.05 + i + this.metallicShimmerOffset;
        let microOpacity = map(sin(microTime), -1, 1, 5, 20);
        fill(255, microOpacity);
        
        let x = cos(microTime * 1.5) * this.size * 0.15;
        let y = sin(microTime * 0.8) * this.size * 0.15;
        circle(x, y, this.size * 0.05);
      }

      // Metallic streak effect
      let streakTime = frameCount * 0.02 + this.metallicShimmerOffset;
      let streakOpacity = map(sin(streakTime), -1, 1, 10, 30);
      stroke(this.metallicHighlightColor);
      strokeWeight(1);
      for (let i = 0; i < 3; i++) {
        let streakX = map(sin(streakTime + i), -1, 1, -this.size * 0.3, this.size * 0.3);
        let streakLength = this.size * 0.4;
        let gradient = drawingContext.createLinearGradient(
          streakX - streakLength/2, 0,
          streakX + streakLength/2, 0
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(0.5, `rgba(255, 255, 220, ${streakOpacity/255})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        drawingContext.strokeStyle = gradient;
        line(streakX - streakLength/2, -this.size * 0.1,
             streakX + streakLength/2, this.size * 0.1);
      }
      
      pop();
    }
    
    // Tail
    push();
    translate(-this.size / 2, 0);
    rotate(this.tailAngle);
    if (this.isColored) {
      fill(this.color);
    } else {
      noFill();
    }
    stroke(255, 100);  
    strokeWeight(1.5);  
    triangle(0, 0, -this.size / 4, -this.size / 6, -this.size / 4, this.size / 6);
    pop();

    // Eye
    fill(255);  
    let eyeSize = this.size / 15;
    ellipse(this.size / 3, -this.size / 12, eyeSize);
    fill(0);  
    ellipse(this.size / 3, -this.size / 12, eyeSize/2);

    // Gills
    stroke(255);  
    line(this.size / 6, -this.size / 8, this.size / 6, this.size / 8);
    line(this.size / 4, -this.size / 10, this.size / 4, this.size / 10);

    pop();
  }
}

class Bubble {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height, height + 100);
    this.size = random(2, 8);  
    this.speed = random(0.5, 1.5);  
    this.wobble = random(0, 1000);
    this.opacity = random(100, 180);  
    this.glowSize = random(1, 3);  
  }

  update() {
    this.y -= this.speed;
    // More complex wobble
    this.x += sin(this.wobble) * 0.3 * (1 + noise(this.wobble * 0.1) * 0.5);
    this.wobble += 0.02;
  }

  display() {
    // Add glow effect
    drawingContext.shadowBlur = this.glowSize * 5;
    drawingContext.shadowColor = color(255, 255, 255, 50);
    
    // Main bubble
    stroke(255, this.opacity);
    strokeWeight(0.5);
    noFill();
    circle(this.x, this.y, this.size);
    
    // Highlight
    stroke(255, this.opacity * 0.7);
    point(this.x + this.size/4, this.y - this.size/4);
    
    // Reset shadow for performance
    drawingContext.shadowBlur = 0;
  }

  isOffScreen() {
    return this.y < -10;
  }
}

class Starburst {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.numRays = floor(random(8, 16));
    this.rayColor = color(goldColors[floor(random(goldColors.length))]);
    this.centerColor = color(goldColors[floor(random(goldColors.length))]);
    this.innerRadius = random(3, 12);
    this.outerRadius = this.innerRadius * random(3, 8);
    this.opacity = random(100, 200);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.005, 0.005);  
    this.lifespan = random(300, 600);  
    this.age = 0;
    this.visible = true;
    this.hideTime = random(200, 400);
    this.hiddenAge = 0;
    this.pulseOffset = random(1000);  
  }

  display() {
    if (!this.visible) {
      this.hiddenAge++;
      if (this.hiddenAge > this.hideTime) {
        this.visible = true;
        this.age = 0;
        this.hiddenAge = 0;
        this.reset();
      }
      return;
    }

    this.age++;
    if (this.age > this.lifespan) {
      this.visible = false;
      return;
    }

    let fadeOpacity = 1;
    const fadeTime = 60;
    if (this.age < fadeTime) {
      fadeOpacity = this.age / fadeTime;
    } else if (this.age > this.lifespan - fadeTime) {
      fadeOpacity = (this.lifespan - this.age) / fadeTime;
    }

    let pulseFactor = 1 + sin(frameCount * 0.02 + this.pulseOffset) * 0.1;

    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    
    // Enhanced Klimt-style glow
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(red(this.rayColor), 
                                     green(this.rayColor), 
                                     blue(this.rayColor), 
                                     this.opacity * 0.4);

    // Draw geometric pattern rays
    for (let i = 0; i < this.numRays; i++) {
      const angle = (i * TWO_PI) / this.numRays;
      const startX = cos(angle) * this.innerRadius * pulseFactor;
      const startY = sin(angle) * this.innerRadius * pulseFactor;
      const endX = cos(angle) * this.outerRadius * pulseFactor;
      const endY = sin(angle) * this.outerRadius * pulseFactor;
      
      // Draw decorative ray pattern
      const segments = 4; 
      for (let j = 0; j < segments; j++) {
        const t1 = j / segments;
        const t2 = (j + 1) / segments;
        const x1 = lerp(startX, endX, t1);
        const y1 = lerp(startY, endY, t1);
        const x2 = lerp(startX, endX, t2);
        const y2 = lerp(startY, endY, t2);
        
        // Alternate colors for segments
        const segmentColor = color(
          red(this.rayColor),
          green(this.rayColor),
          blue(this.rayColor),
          this.opacity * (0.4 + (j % 2) * 0.6) * fadeOpacity
        );
        
        stroke(segmentColor);
        strokeWeight(2 + (segments - j) * this.innerRadius/15);
        line(x1, y1, x2, y2);
        
        // Add geometric accents
        if (j < segments - 1) {
          const accentColor = color(klimtAccentColors[j % klimtAccentColors.length]);
          fill(red(accentColor), green(accentColor), blue(accentColor), 
               this.opacity * 0.3 * fadeOpacity);
          noStroke();
          const size = this.innerRadius * 0.2 * (segments - j) / segments;
          circle(x2, y2, size);
        }
      }
    }
    
    // Reset shadow for performance
    drawingContext.shadowBlur = 0;
    
    // Draw ornate center
    noStroke();
    // Outer decorative ring
    for (let i = 0; i < 12; i++) {
      const angle = (i * TWO_PI) / 12;
      fill(this.centerColor);
      const ringSize = this.innerRadius * 0.4;
      circle(cos(angle) * this.innerRadius * 1.8, 
             sin(angle) * this.innerRadius * 1.8, 
             ringSize);
    }
    
    // Center layers
    fill(red(this.centerColor), green(this.centerColor), blue(this.centerColor), 
         this.opacity * 0.3 * fadeOpacity);
    circle(0, 0, this.innerRadius * 2.2 * pulseFactor);
    fill(red(this.centerColor), green(this.centerColor), blue(this.centerColor), 
         this.opacity * fadeOpacity);
    circle(0, 0, this.innerRadius * 2 * pulseFactor);
    
    // Add geometric center pattern
    const centerPattern = 8;
    for (let i = 0; i < centerPattern; i++) {
      const angle = (i * TWO_PI) / centerPattern;
      fill(klimtAccentColors[i % klimtAccentColors.length]);
      const patternSize = this.innerRadius * 0.3;
      const dist = this.innerRadius * 0.8;
      circle(cos(angle) * dist, sin(angle) * dist, patternSize);
    }
    
    this.rotation += this.rotationSpeed;
    pop();
  }
}

class Snail {
  constructor(x, y, size, isClockHand = false, handType = '') {
    this.position = createVector(x, y);
    this.size = size;
    this.shellSpirals = 4;
    this.shellRotation = 0;
    this.patternOffset = random(TWO_PI);
    this.isClockHand = isClockHand;
    this.handType = handType;
    this.angle = 0;  
    
    // Direction the snail faces (-1 for left, 1 for right)
    this.direction = 1;
    
    // Enhanced Klimt-style colors and patterns
    let shellHue = random(360);
    let shellSat = random(70, 90);
    let shellBright = random(50, 80);  
    colorMode(HSB, 360, 100, 100, 255);
    this.shellColor = color(shellHue, shellSat, shellBright);
    
    let bodyHue = (shellHue + random(120, 240)) % 360;
    this.bodyColor = color(bodyHue, shellSat, shellBright);
    
    // Create metallic highlight color in HSB mode
    this.metallicHighlightColor = color(random(20, 45), 80, random(50, 70));  
    
    colorMode(RGB, 255, 255, 255, 255);
    this.accentColor = color(random(klimtAccentColors));
    this.hasSpirals = random() < 0.8;
    this.hasGoldSpots = random() < 0.8;
    this.spotSize = random(5, 12);
    
    this.metallicShimmerOffset = random(1000);
    this.hasMetallicEdge = true;
    this.metallicEdgeWidth = random(4, 8);
  }

  update() {
    if (this.isClockHand) {
      // Update angle based on current time
      let currentTime = new Date();
      if (this.handType === 'hour') {
        this.angle = map(currentTime.getHours() % 12 + currentTime.getMinutes() / 60, 0, 12, 0, 1);
      } else if (this.handType === 'minute') {
        this.angle = map(currentTime.getMinutes() + currentTime.getSeconds() / 60, 0, 60, 0, 1);
      } else if (this.handType === 'second') {
        this.angle = map(currentTime.getSeconds() + currentTime.getMilliseconds() / 1000, 0, 60, 0, 1);
      }
      
      // Calculate position along the ground using full screen width
      let margin = 100; 
      this.position.x = margin + (width - 2 * margin) * this.angle;
      this.position.y = height; 
      
      // Update direction based on position
      let prevDirection = this.direction;
      this.direction = (this.angle < 0.5) ? 1 : -1;
      
      // Animate shell rotation when changing direction
      if (prevDirection !== this.direction) {
        this.shellRotation = PI;
      }
    }
    
    // Gentle shell rotation animation
    this.shellRotation = lerp(this.shellRotation, 0, 0.1);
  }

  display() {
    push();
    translate(this.position.x, this.position.y);
    scale(this.direction, 1); 
    
    // Draw snail body
    push();
    fill(this.bodyColor);
    noStroke();
    beginShape();
    vertex(-this.size * 0.4, 0);
    bezierVertex(
      -this.size * 0.3, -this.size * 0.2,
      -this.size * 0.1, -this.size * 0.25,
      this.size * 0.1, -this.size * 0.2
    );
    bezierVertex(
      this.size * 0.2, -this.size * 0.1,
      this.size * 0.25, 0,
      this.size * 0.3, 0
    );
    vertex(this.size * 0.3, 0);
    endShape();
    
    // Draw antennae
    stroke(this.bodyColor);
    strokeWeight(2);
    let antennaWave = sin(frameCount * 0.1) * 0.2;
    line(0, -this.size * 0.2, -this.size * 0.15, -this.size * 0.4 + antennaWave);
    line(this.size * 0.1, -this.size * 0.2, this.size * 0.0, -this.size * 0.4 + antennaWave);
    
    // Draw small eyes at antenna tips
    noStroke();
    fill(this.accentColor);
    circle(-this.size * 0.15, -this.size * 0.4 + antennaWave, 4);
    circle(this.size * 0.0, -this.size * 0.4 + antennaWave, 4);
    pop();

    // Draw shell with Klimt-style patterns
    push();
    translate(-this.size * 0.2, -this.size * 0.3);
    rotate(this.shellRotation);
    
    // Base shell shape
    fill(this.shellColor);
    stroke(this.accentColor);
    strokeWeight(1.5);
    beginShape();
    for (let angle = 0; angle < TWO_PI * this.shellSpirals; angle += 0.1) {
      let r = (this.size * 0.3) * (1 - angle / (TWO_PI * this.shellSpirals));
      let x = r * cos(angle);
      let y = r * sin(angle);
      vertex(x, y);
    }
    endShape();

    // Add decorative patterns
    if (this.hasSpirals) {
      stroke(this.metallicHighlightColor);
      strokeWeight(1);
      noFill();
      for (let i = 0; i < 3; i++) {
        beginShape();
        for (let angle = 0; angle < TWO_PI * 2; angle += 0.2) {
          let r = (this.size * 0.25) * (1 - angle / (TWO_PI * 2)) * (1 - i * 0.2);
          let x = r * cos(angle + this.patternOffset);
          let y = r * sin(angle + this.patternOffset);
          vertex(x, y);
        }
        endShape();
      }
    }

    // Add gold spots
    if (this.hasGoldSpots) {
      noStroke();
      fill(this.metallicHighlightColor);
      for (let i = 0; i < 12; i++) {
        let angle = (TWO_PI * i / 12) + sin(frameCount * 0.02 + i) * 0.2;
        let r = this.size * 0.2 * (1 - i / 24);
        let x = r * cos(angle);
        let y = r * sin(angle);
        circle(x, y, this.spotSize * (1 - i / 12));
      }
    }

    // Add metallic edge if enabled
    if (this.hasMetallicEdge) {
      push();
      blendMode(ADD);
      stroke(this.metallicHighlightColor);
      strokeWeight(this.metallicEdgeWidth);
      noFill();
      beginShape();
      for (let angle = 0; angle < TWO_PI * this.shellSpirals; angle += 0.1) {
        let r = (this.size * 0.3) * (1 - angle / (TWO_PI * this.shellSpirals));
        let shimmer = sin(frameCount * 0.05 + angle + this.metallicShimmerOffset) * 2;
        let x = (r + shimmer) * cos(angle);
        let y = (r + shimmer) * sin(angle);
        vertex(x, y);
      }
      endShape();
      pop();
    }
    pop();
    pop();
  }
}

class Seaweed {
  constructor(x, baseY) {
    this.x = x;
    this.y = baseY;
    this.segments = 5;  
    this.segmentLength = 20;  
    this.angle = PI/6;  
    this.noiseOffset = random(1000);
    this.thickness = random(2, 4);  
    // Klimt-inspired metallic colors
    this.mainColor = color(random(goldColors));
    this.accentColor = color(random(klimtAccentColors));
    this.shimmerOffset = random(1000);
    
    // Pre-calculate branch structure
    this.branches = [];
    for (let i = 0; i < this.segments; i++) {
      this.branches.push({
        leftBranch: random() < 0.7 && i > 1,  
        rightBranch: random() < 0.7 && i > 1,
        branchAngleOffset: random(-0.1, 0.1)
      });
    }
  }

  display() {
    push();
    this.noiseOffset += 0.01;
    let time = frameCount * 0.02;
    
    // Start at base position
    translate(this.x, this.y);
    
    // Add some gentle swaying motion
    let baseAngle = sin(time + this.noiseOffset) * 0.1;
    rotate(baseAngle);
    
    // Draw the main branch
    this.drawBranch(this.segments, this.segmentLength, -PI/2, this.thickness, 0);
    pop();
  }

  drawBranch(depth, length, angle, thickness, branchIndex) {
    if (depth <= 0) return;

    // Calculate current position for shimmer effect
    let shimmerX = cos(angle) * length;
    let shimmerY = sin(angle) * length;
    
    // Create shimmering effect using frameCount
    let currentTime = frameCount * 0.02;
    let shimmerAmount = noise(this.shimmerOffset + currentTime + branchIndex) * 0.3;
    
    // Draw current segment with gradient
    push();
    let gradient = drawingContext.createLinearGradient(0, 0, shimmerX, shimmerY);
    gradient.addColorStop(0, color(this.mainColor).toString());
    gradient.addColorStop(1, color(this.accentColor).toString());
    drawingContext.strokeStyle = gradient;
    strokeWeight(thickness);
    line(0, 0, shimmerX, shimmerY);
    
    // Move to end of current segment
    translate(shimmerX, shimmerY);
    
    // Add some organic movement
    let noiseVal = noise(this.noiseOffset + depth * 0.3, currentTime);
    let newAngle = angle + map(noiseVal, 0, 1, -0.1, 0.1);
    
    let branchData = this.branches[this.segments - depth];
    
    // Add branches with some randomness
    if (branchData) {
      if (branchData.leftBranch) {
        push();
        rotate(-this.angle + branchData.branchAngleOffset);
        this.drawBranch(depth - 1, length * 0.7, newAngle, thickness * 0.7, branchIndex + 1);
        pop();
      }
      if (branchData.rightBranch) {
        push();
        rotate(this.angle + branchData.branchAngleOffset);
        this.drawBranch(depth - 1, length * 0.7, newAngle, thickness * 0.7, branchIndex + 1);
        pop();
      }
    }
    
    // Continue main branch
    this.drawBranch(depth - 1, length * 0.9, newAngle, thickness * 0.9, branchIndex);
    pop();
  }
}

class CoralFormation {
  constructor(x, baseY) {
    this.x = x;
    this.y = baseY;
    this.size = random(40, 80);
    this.pattern = floor(random(3));  
    this.mainColor = color(random(goldColors));
    this.accentColor = color(random(klimtAccentColors));
    this.shimmerOffset = random(1000);
    this.segments = floor(random(3, 6));
    this.rotationOffset = random(TWO_PI);
    
    // Pre-calculate pattern details
    this.details = {
      circles: Array(5).fill().map(() => ({
        x: random(-this.size/2, this.size/2),
        y: random(-this.size/2, 0),
        size: random(10, 25),
        rotation: random(TWO_PI)
      })),
      spiralDensity: random(0.3, 0.5),
      geometricPoints: Array(6).fill().map(() => ({
        angle: random(TWO_PI),
        length: random(0.3, 1)
      }))
    };
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(sin(frameCount * 0.02 + this.rotationOffset) * 0.1);
    
    // Add shimmer effect
    let shimmerAmount = noise(this.shimmerOffset + frameCount * 0.02) * 0.3;
    
    // Draw based on pattern type
    if (this.pattern === 0) {
      this.drawCirclePattern(shimmerAmount);
    } else if (this.pattern === 1) {
      this.drawSpiralPattern(shimmerAmount);
    } else {
      this.drawGeometricPattern(shimmerAmount);
    }
    pop();
  }

  drawCirclePattern(shimmerAmount) {
    noStroke();
    for (let circle of this.details.circles) {
      fill(lerpColor(this.mainColor, this.accentColor, shimmerAmount));
      push();
      translate(circle.x, circle.y);
      rotate(circle.rotation + frameCount * 0.01);
      ellipse(0, 0, circle.size);
      pop();
    }
  }

  drawSpiralPattern(shimmerAmount) {
    let density = this.details.spiralDensity;
    noFill();
    strokeWeight(2);
    
    for (let i = 0; i < 3; i++) {
      let t = frameCount * 0.02 + i * TWO_PI/3;
      stroke(lerpColor(this.mainColor, this.accentColor, shimmerAmount));
      
      beginShape();
      for (let angle = 0; angle < TWO_PI * 2; angle += 0.1) {
        let r = map(angle, 0, TWO_PI * 2, 0, this.size/2);
        let x = cos(angle + t) * r * density;
        let y = sin(angle + t) * r * density;
        vertex(x, y);
      }
      endShape();
    }
  }

  drawGeometricPattern(shimmerAmount) {
    noStroke();
    fill(lerpColor(this.mainColor, this.accentColor, shimmerAmount));
    
    beginShape();
    for (let point of this.details.geometricPoints) {
      let r = this.size/2 * point.length;
      let x = cos(point.angle + frameCount * 0.02) * r;
      let y = sin(point.angle + frameCount * 0.02) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

class CelestialBody {
  constructor(isDay) {
    this.isDay = isDay;
    this.size = 80;
    this.shimmerOffset = random(1000);
    this.patternOffset = random(TWO_PI);
    this.rotationSpeed = random(0.001, 0.002);
    this.tailAngle = 0;
    this.tailSpeed = 0.03;
    
    // Klimt-inspired colors
    colorMode(HSB, 360, 100, 100, 255);
    if (isDay) {
      // Sun-fish colors - warm golds and oranges
      this.mainColor = color(45, 80, 95);  
      this.accentColor = color(30, 90, 100);  
      this.rayColor = color(45, 70, 100, 150);  
      this.finColor = color(40, 85, 95);  
    } else {
      // Moon-fish colors - cool silvers and deep blues
      this.mainColor = color(230, 30, 35);  
      this.accentColor = color(220, 40, 25);  
      this.rayColor = color(200, 30, 40, 100);  
      this.finColor = color(210, 35, 30);  
    }
    colorMode(RGB, 255, 255, 255, 255);
  }
  
  display(x, y) {
    push();
    translate(x, y);
    
    // Add glow effect
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = this.isDay ? 
      color(255, 200, 100, 100).toString() : 
      color(200, 220, 255, 100).toString();
    
    // Draw rays/fins
    push();
    rotate(frameCount * this.rotationSpeed);
    stroke(this.rayColor);
    let numRays = this.isDay ? 12 : 8;
    for (let i = 0; i < numRays; i++) {
      let angle = (TWO_PI * i) / numRays;
      // Make rays more fin-like with curved shape
      let rayLength = this.size * (1.2 + sin(frameCount * 0.05 + i) * 0.2);
      strokeWeight(2 + sin(frameCount * 0.05 + i) * 1);
      
      // Draw curved fin-like rays
      beginShape();
      noFill();
      for (let t = 0; t <= 1; t += 0.1) {
        let r = rayLength * (1 - t * 0.3);
        let curve = sin(t * PI) * 20;
        let px = cos(angle) * r + cos(angle + PI/2) * curve;
        let py = sin(angle) * r + sin(angle + PI/2) * curve;
        vertex(px, py);
      }
      endShape();
    }
    pop();
    
    // Fish body (modified circle)
    this.tailAngle = sin(frameCount * this.tailSpeed) * PI/6;
    
    // Draw fish body
    noStroke();
    fill(this.mainColor);
    beginShape();
    let bodyPoints = 32;
    for (let i = 0; i < bodyPoints; i++) {
      let angle = (TWO_PI * i) / bodyPoints;
      let r = this.size/2;
      // Make body more fish-like with tapered tail
      if (angle > PI/2 && angle < 3*PI/2) {
        r *= 0.8 + cos(angle) * 0.2;
      }
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw tail
    push();
    translate(-this.size/2, 0);
    rotate(this.tailAngle);
    fill(this.mainColor);
    let tailSize = this.size * 0.4;
    triangle(0, 0, -tailSize, -tailSize/2, -tailSize, tailSize/2);
    pop();
    
    // Draw dorsal and pectoral fins
    fill(this.finColor);
    // Dorsal fin
    push();
    translate(0, -this.size/2);
    rotate(-PI/4 + sin(frameCount * 0.05) * 0.1);
    triangle(0, 0, this.size * 0.3, -this.size * 0.3, -this.size * 0.1, -this.size * 0.2);
    pop();
    
    // Pectoral fins
    for (let side of [-1, 1]) {
      push();
      translate(0, this.size/4 * side);
      rotate(PI/6 * side + sin(frameCount * 0.05) * 0.1);
      triangle(0, 0, this.size * 0.2, this.size * 0.15 * side, -this.size * 0.1, this.size * 0.1 * side);
      pop();
    }
    
    // Eye
    fill(255);
    let eyeSize = this.size * 0.15;
    circle(this.size * 0.2, -this.size * 0.1, eyeSize);
    fill(0);
    circle(this.size * 0.2, -this.size * 0.1, eyeSize * 0.5);
    
    // Decorative patterns
    if (this.isDay) {
      // Sun-fish patterns - scales and spots
      stroke(this.accentColor);
      noFill();
      strokeWeight(1);
      for (let i = 0; i < 3; i++) {
        let scaleSize = this.size * 0.1;
        for (let j = 0; j < 5; j++) {
          let x = -this.size * 0.3 + j * scaleSize;
          let y = -this.size * 0.2 + i * scaleSize;
          arc(x, y, scaleSize, scaleSize, PI, TWO_PI);
        }
      }
    } else {
      // Moon-fish patterns - crescent shapes
      noStroke();
      fill(this.accentColor);
      for (let i = 0; i < 5; i++) {
        let angle = random(TWO_PI);
        let r = random(this.size * 0.1, this.size * 0.3);
        let x = cos(angle) * r;
        let y = sin(angle) * r;
        let spotSize = random(5, 10);
        arc(x, y, spotSize, spotSize, 0, PI);
      }
    }
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255, 255, 255, 255);
  background(0);
  
  // Initialize your artwork components here
  // Initialize mosaic tiles with overlap
  let stepSize = tileSize * (1 - tileOverlap);
  let cols = ceil(width / stepSize) + 2;  
  let rows = ceil(height / stepSize) + 2;  
  
  for (let y = -1; y < rows; y++) {  
    for (let x = -1; x < cols; x++) {  
      mosaicTiles.push(new MosaicTile(x * stepSize, y * stepSize));
    }
  }
  
  // Set initial visibility
  updateBackgroundVisibility();
  
  // Initialize light rays
  for (let i = 0; i < numRays; i++) {
    lightRays.push({
      x: random(width),
      width: random(30, 100),
      speed: random(0.0001, 0.0003),
      offset: random(1000)
    });
  }
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 6),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.1, -0.3),
      opacity: random(100, 200)
    });
  }
  
  // Initialize fish with better distribution and varied sizes
  for (let i = 0; i < numFish; i++) {
    // Create a grid-like initial distribution
    let row = floor(i / 3);
    let col = i % 3;
    let x = map(col, 0, 2, width * 0.2, width * 0.8) + random(-50, 50);
    let y = map(row, 0, ceil(numFish/3) - 1, height * 0.2, height * 0.6) + random(-50, 50);
    
    // Create three size categories
    let sizeCategory = random(1);
    let fishSize;
    if (sizeCategory < 0.3) {  
      fishSize = random(60, 100);
    } else if (sizeCategory < 0.7) {  
      fishSize = random(100, 160);
    } else {  
      fishSize = random(160, 200);
    }
    
    let fish = new Fish(
      x, y,
      fishSize,
      random(1000),
      random(1000),
      random(0.02, 0.04)
    );
    fishes.push(fish);
  }

  // Create initial bubbles
  for (let i = 0; i < numBubbles; i++) {
    bubbles.push(new Bubble());
  }

  // Create initial starbursts
  for (let i = 0; i < numStarbursts; i++) {
    starbursts.push(new Starburst());
  }

  // Initialize floating patterns
  for (let i = 0; i < numFloatingPatterns; i++) {
    floatingPatterns.push(new FloatingPattern());
  }

  // Initialize corals at different positions along the bottom
  for (let i = 0; i < numCoralFormations; i++) {
    let x = map(i, 0, numCoralFormations - 1, width * 0.05, width * 0.95) + random(-30, 30);
    coralFormations.push(new CoralFormation(x, height));
  }

  // Initialize seaweed at different positions along the bottom with varied heights
  for (let i = 0; i < numSeaweeds * 2; i++) {  
    let x = random(width * 0.05, width * 0.95);  
    let baseY = height;  
    let seaweed = new Seaweed(x, baseY);
    seaweed.segments = floor(random(4, 8));  
    seaweed.segmentLength = random(15, 25);  
    seaweeds.push(seaweed);
  }

  // Initialize seaweed clusters with more variety
  for (let i = 0; i < numSeaweedClusters * 1.5; i++) {  
    let x = random(width * 0.05, width * 0.95);
    let baseY = height;  
    let numInCluster = floor(random(3, 8));  
    
    let cluster = [];
    for (let j = 0; j < numInCluster; j++) {
      let offsetX = random(-40, 40);  
      let seaweed = new Seaweed(x + offsetX, baseY);
      seaweed.segments = floor(random(3, 7));  
      seaweed.segmentLength = random(15, 25);  
      cluster.push(seaweed);
    }
    seaweedClusters.push(cluster);
  }
  
  // Initialize clock snails at the leftmost position
  let margin = 100;
  hourSnail = new Snail(margin, height, 120, true, 'hour');
  minuteSnail = new Snail(margin, height, 100, true, 'minute');
  secondSnail = new Snail(margin, height, 80, true, 'second');
  
  // Initialize seaweed markers for clock positions across full width
  for (let i = 0; i < 13; i++) { 
    let x = margin + ((width - 2 * margin) * (i/12));
    let y = height; 
    let marker = new Seaweed(x, y);
    // Set red color scheme for markers
    marker.mainColor = color(255, 50, 50); 
    marker.accentColor = color(200, 30, 30); 
    seaweedMarkers.push(marker);
  }
  
  // Remove any existing seaweeds that might interfere with the clock
  seaweeds = [];
  
  // Initialize celestial bodies
  for (let i = 0; i < numCelestialBodies; i++) {
    let isDay = i % 2 === 0;
    let x = map(i, 0, numCelestialBodies - 1, width * 0.1, width * 0.9);
    let y = height * 0.2;
    let celestialBody = new CelestialBody(isDay);
    celestialBodies.push({ body: celestialBody, x: x, y: y });
  }
  
  // Call fxpreview() after the first frame is rendered
  if (window.fxpreview) {
    fxpreview();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // Darker background for better contrast
  let time = frameCount * 0.001;
  let bgNoise = noise(time) * 5;
  let bgBrightness = map(backgroundVisibility, 0, 9, 15, 40);  
  let blueVariation = noise(time * 0.3) * 10;
  background(0, 0, bgBrightness + bgNoise + blueVariation);
  
  // Add streaky white wash effect
  push();
  blendMode(SCREEN);
  noStroke();
  for (let i = 0; i < 35; i++) {
    let yPos = (noise(i * 100 + time * 0.5) * height);
    let xOffset = noise(i * 200 + time) * width;
    let streakWidth = noise(i * 300) * 400 + 150;
    let streakHeight = noise(i * 400) * 120 + 30;
    let opacity = noise(i * 500 + time * 0.3) * 35 + 8;
    
    // Create gradient for each streak
    let gradient = drawingContext.createLinearGradient(
      xOffset - streakWidth/2, yPos,
      xOffset + streakWidth/2, yPos
    );
    
    // Randomize gradient style
    if (i % 3 === 0) {  
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.3, `rgba(255, 255, 255, ${opacity/255 * 0.5})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity/255})`);
      gradient.addColorStop(0.7, `rgba(255, 255, 255, ${opacity/255 * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity/255})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }
    
    drawingContext.fillStyle = gradient;
    ellipse(xOffset, yPos, streakWidth, streakHeight);
  }
  pop();
  
  // Draw mosaic background first
  push();
  blendMode(MULTIPLY);
  for (let tile of mosaicTiles) {
    tile.display();
  }
  pop();
  
  // Draw atmospheric effects
  push();
  blendMode(SCREEN);
  drawAtmosphericEffects();
  pop();
  
  // Draw corals
  push();
  blendMode(SCREEN);
  for (let coral of coralFormations) {
    coral.display();
  }
  pop();
  
  // Draw seaweed
  push();
  blendMode(SCREEN);
  for (let seaweed of seaweeds) {
    seaweed.display();
  }
  pop();
  
  // Draw seaweed clusters
  push();
  blendMode(SCREEN);
  for (let cluster of seaweedClusters) {
    for (let seaweed of cluster) {
      seaweed.display();
    }
  }
  pop();
  
  // Draw seaweed markers first
  push();
  for (let seaweed of seaweedMarkers) {
    seaweed.display();
  }
  pop();
  
  // Draw snails in order of size (largest in back)
  push();
  blendMode(SCREEN);
  
  // Update all snails
  hourSnail.update();
  minuteSnail.update();
  secondSnail.update();
  
  // Draw largest to smallest for proper layering
  hourSnail.display();
  minuteSnail.display();
  secondSnail.display();
  pop();
  
  // Draw starbursts
  push();
  blendMode(ADD);
  for (let starburst of starbursts) {
    starburst.display();
  }
  pop();
  
  // Draw floating patterns
  push();
  blendMode(SCREEN);
  for (let pattern of floatingPatterns) {
    pattern.update();
    pattern.display();
  }
  pop();
  
  // Draw fish with normal blend mode and increased contrast
  push();
  blendMode(BLEND);
  for (let fish of fishes) {
    fish.update();
    push();
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'rgba(255, 255, 255, 0.3)';
    fish.display();
    pop();
  }
  pop();
  
  // Draw bubbles last
  push();
  blendMode(SCREEN);
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display();
    if (bubbles[i].isOffScreen()) {
      bubbles[i] = new Bubble();
    }
  }
  pop();
  
  // Draw celestial bodies based on current time
  push();
  blendMode(SCREEN);
  let currentTime = new Date();
  let isAM = currentTime.getHours() < 12;
  
  // Only show sun in AM, only show moon in PM
  let sun = celestialBodies[0].body;
  let moon = celestialBodies[1].body;
  
  if (isAM) {
    sun.display(width * 0.95, height * 0.08);  
  } else {
    moon.display(width * 0.95, height * 0.08); 
  }
  pop();
  
  // Update and draw ripples last
  push();
  blendMode(SCREEN);
  updateRipples();
  for (let ripple of ripples) {
    ripple.display();
  }
  pop();
  
  // Draw ground elements
  push();
  blendMode(MULTIPLY);
  
  // Draw sandy ground texture
  let groundHeight = 100;
  let groundGradient = drawingContext.createLinearGradient(0, height - groundHeight, 0, height);
  groundGradient.addColorStop(0, 'rgba(210, 180, 140, 0)');  
  groundGradient.addColorStop(1, 'rgba(210, 180, 140, 0.3)'); 
  drawingContext.fillStyle = groundGradient;
  rect(0, height - groundHeight, width, groundHeight);
  
  // Add ripple patterns in the sand
  noFill();
  stroke(255, 255, 220, 30);
  for (let i = 0; i < 8; i++) {
    let y = height - random(groundHeight);
    let amplitude = random(5, 15);
    let frequency = random(0.01, 0.03);
    
    beginShape();
    for (let x = 0; x < width; x += 10) {
      let yOffset = sin(x * frequency + frameCount * 0.01) * amplitude;
      vertex(x, y + yOffset);
    }
    endShape();
  }
  
  // Draw all ground elements
  for (let coral of coralFormations) {
    coral.display();
  }
  
  for (let cluster of seaweedClusters) {
    for (let seaweed of cluster) {
      seaweed.display();
    }
  }
  pop();
}

function keyPressed() {
  // Number keys 0-9 control visibility
  if (key >= '0' && key <= '9') {
    backgroundVisibility = parseInt(key);
    updateBackgroundVisibility();
  }
}

function updateBackgroundVisibility() {
  // Calculate opacity values based on visibility level (0-9)
  let mainOpacity = map(backgroundVisibility, 0, 9, 0, 255);
  let accentOpacity = map(backgroundVisibility, 0, 9, 0, 200);
  
  // Update all mosaic tiles with new opacity and blue variations
  for (let tile of mosaicTiles) {
    let baseColor = color(goldColors[floor(random(goldColors.length))]);
    // Add subtle blue tint to base colors
    let blueShift = random(-10, 20);
    tile.color = color(
      red(baseColor),
      green(baseColor),
      min(255, blue(baseColor) + blueShift),
      mainOpacity
    );
    
    let accentBase = color(klimtAccentColors[floor(random(klimtAccentColors.length))]);
    // Add subtle blue depth to accent colors
    let blueDepth = random(-5, 15);
    tile.accentColor = color(
      red(accentBase),
      green(accentBase),
      min(255, blue(accentBase) + blueDepth),
      accentOpacity
    );
  }
}

function drawAtmosphericEffects() {
  // Draw light rays
  push();
  blendMode(SCREEN);
  noStroke();
  for (let ray of lightRays) {
    let rayX = ray.x + sin(frameCount * ray.speed + ray.offset) * 50;
    let gradient = drawingContext.createLinearGradient(rayX, 0, rayX + ray.width, height);
    gradient.addColorStop(0, 'rgba(255, 255, 220, 0)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 220, 0.03)');
    gradient.addColorStop(1, 'rgba(255, 255, 220, 0)');
    drawingContext.fillStyle = gradient;
    rect(rayX, 0, ray.width, height);
  }
  pop();
  
  // Draw floating particles
  push();
  blendMode(SCREEN);
  noStroke();
  for (let p of particles) {
    // Update position
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Reset if out of bounds
    if (p.y < -10) {
      p.y = height + 10;
      p.x = random(width);
    }
    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    
    // Draw particle with gradient
    let gradient = drawingContext.createRadialGradient(
      p.x, p.y, 0,
      p.x, p.y, p.size
    );
    gradient.addColorStop(0, `rgba(255, 248, 220, ${p.opacity/255})`);
    gradient.addColorStop(1, 'rgba(255, 248, 220, 0)');
    drawingContext.fillStyle = gradient;
    circle(p.x, p.y, p.size * 2);
  }
  pop();
  
  // Draw vignette effect
  push();
  blendMode(MULTIPLY);
  noStroke();
  let vignetteSize = max(width, height) * 1.5;
  let gradient = drawingContext.createRadialGradient(
    width/2, height/2, 0,
    width/2, height/2, vignetteSize/2
  );
  
  // Randomize gradient style
  gradient.addColorStop(0, 'rgba(0, 0, 20, 0)');
  gradient.addColorStop(0.7, 'rgba(0, 0, 20, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 20, 0.3)');
  drawingContext.fillStyle = gradient;
  rect(0, 0, width, height);
  pop();
}

function updateRipples() {
  // Create new ripples based on fish movement
  for (let fish of fishes) {
    if (random() < 0.05) { 
      ripples.push(new Ripple(fish.position.x, fish.position.y));
    }
  }
  
  // Update and filter out dead ripples
  ripples = ripples.filter(ripple => ripple.update());
}