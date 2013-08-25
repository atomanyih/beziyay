var canvas = document.getElementById('canvas'),
    WIDTH = canvas.width,
    HEIGHT = canvas.height,
    ctx = canvas.getContext('2d'),
    controlPoints = [];
    ANIMATION_STEPS = 100;
    FRAMERATE = 60,
    currentPoint = null,
    hoveredPoint = null,
    RESOLUTION = 10,
    dragging = false;


var drawer = Drawer();

function Drawer() {
  var controlPoints = [],
      t = 0;

  var DRAW_POINTS = true,
      DRAW_LINES = true,
      DRAW_BEZIERS = true;

  function drawAt(t) {
    points = [controlPoints];
    t = t%ANIMATION_STEPS;
    for (var i = 1; i < points[0].length; i++) {
      points[i] = [];
      for (var j = 0; j < points[i-1].length - 1; j++) {
        points[i][j] = interpolate(points[i-1][j],points[i-1][j+1],t/ANIMATION_STEPS);
      }
    }

    // Lines
    if(DRAW_LINES) {
      for (var i = 0; i < points.length - 1; i++) {
        array = points[i];

        for (var j = 0; j < array.length - 1; j++) {
          var x0 = array[j][0],
              y0 = array[j][1],
              x1 = array[j+1][0],
              y1 = array[j+1][1];

          ctx.beginPath();
          ctx.moveTo(x0,y0);
          ctx.lineTo(x1,y1);
          ctx.strokeStyle = 'rgba(255,255,255,.5)';
          ctx.lineWidth = 1;
          ctx.stroke();

        }
      }
    }

    // Beziers
    if(DRAW_BEZIERS) {
      for (var i = 0; i < points.length; i++) {
        var cps = points[i],
            bezier = new Bezier(cps);

        ctx.strokeStyle = rgb(255,255,255);
        if (i === 0)
          ctx.lineWidth = 3;
        else 
          ctx.lineWidth = 2;
        bezier.drawPlain(ctx);
      }
    }

    // Points
    if(DRAW_POINTS) {
      ctx.fillStyle = rgb(255,0,0);

      for (var i = 1; i < points.length; i++) {
        array = points[i];

        for (var j = 0; j < array.length; j++) {

          drawPoint(array[j],2);
        }
      }
    }


  }

  return {
    advance: function() {
      t++;
      if(t > ANIMATION_STEPS) {
        t = 0;
      }
    },
    numPoints: function() {
      return controlPoints.length;
    },
    set: function(points) {
      controlPoints = points;
    },
    draw: function(n) {
      for (var i = 0; i < n; i++) {
        drawAt(t + ANIMATION_STEPS/n * i);
      }
    },
    togglePoints: function() {
      DRAW_POINTS = !DRAW_POINTS;
    },
    toggleLines: function() {
      DRAW_LINES = !DRAW_LINES;
    },
    toggleBeziers: function() {
      DRAW_BEZIERS = !DRAW_BEZIERS;
    }
  }
}

function rgb(r,g,b) {
  return 'rgb(' + r +','+g+','+b+')';
}

function drawPoint(v,size) {
  var x = v[0],
      y = v[1];

  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI, false);
  ctx.fill();
}

function drawControlPoints() {
  for (var i = 0; i < controlPoints.length; i++) {
    point = controlPoints[i];
    ctx.fillStyle = rgb(255,0,0);

    drawPoint(point,3);
    if (i == currentPoint) {
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}

function drawBackground() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  // ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillRect(0,0,WIDTH,HEIGHT);
}

function randomPointOnCanvas() {
  var x = Math.floor(Math.random() * WIDTH),
      y = Math.floor(Math.random() * HEIGHT);

  return [x,y];
}

function interpolate(v1,v2,mu) {
  var v3 = [];
  v3[0] = v1[0]*(1-mu) + v2[0] * mu;
  v3[1] = v1[1]*(1-mu) + v2[1] * mu;
  return v3;
}

function addControlPoint() {
  point = randomPointOnCanvas();
  controlPoints.push(point);
  $('.point_list').append(controlPointHTML(point));
  bindControlPointLinks();
  setCurrentPoint(controlPoints.length - 1);
}

function removeControlPoint(i) {
  controlPoints.splice(i,1);
  $('.point_list li').eq(i).remove();
  draw();
}

function setControlPoint(i,v) {
  controlPoints[i] = v;

  $('.point_list :nth-child('+(i+1)+') .control_point').text('('+v+')');
}

function setCurrentPoint(i) {
  currentPoint = i;
  $('.point_list').find('.current_point').removeClass('current_point');
  $('.point_list li:nth-child('+(i+1)+')').addClass('current_point');
}

function setHoveredPoint(i) {
  hoveredPoint = i;
}

function setAnimationSteps(steps) {
  ANIMATION_STEPS = steps;
}

function controlPointHTML(point) {
  return '<li><a class="control_point" href="#">('+point+')</a> <a class="remove_point" href="#">-</a></li>'
}

function bindControlPointLinks() {
  $('.control_point').each( function(index) {
    $(this).unbind('click');
    $(this).click( function(event) {
      event.preventDefault();
      setCurrentPoint(index);
    });
  });

  $('.remove_point').each( function(index) {
    $(this).unbind('click');
    $(this).click( function(event) {
      event.preventDefault();
      removeControlPoint(index);
    });
  });
}

function advance() {
  drawer.advance();
}

function draw() {
  drawer.set(controlPoints);
  drawBackground();
  drawer.draw(4);
  drawControlPoints();
}

function resizeCanvas() {
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  WIDTH = ctx.canvas.width;
  HEIGHT = ctx.canvas.height;
}

function mainLoop() {
  draw();
  advance();

  setTimeout(mainLoop,1000/FRAMERATE);
}

$( function() {

  canvas.onmousedown = function(event) {
    dragging = true;
    var mouseX = event.clientX,
        mouseY = event.clientY;

    setControlPoint(currentPoint,[mouseX,mouseY]);
  };

  canvas.onmouseup = function(event) {
    dragging = false;
  }

  canvas.onmousemove = function(event) {
    if(dragging) {
      var mouseX = event.clientX,
          mouseY = event.clientY;

      setControlPoint(currentPoint,[mouseX,mouseY]);
    }
  }

  document.onkeypress = function(event) {
    var keyCode = event.keyCode;
    if(keyCode >= 49 && keyCode < (49 + drawer.numPoints())) {
      setCurrentPoint(keyCode - 49);
    }
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  bindControlPointLinks();

  $('.add_control_point').click(function(event) {
    event.preventDefault();

    addControlPoint();
  });

  $('#animation_speed').change(function(event) {
    setAnimationSteps($(this).val());
  });

  addControlPoint();
  addControlPoint();
  addControlPoint();

  mainLoop();
});

