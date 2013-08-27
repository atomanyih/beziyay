// color.js
// requires math.js

var Color = {
  interpolate: function(v1,v2,mu) {
    var v3 = [];
    for (var i = 0; i < v1.length; i++) {
      v3[i] = v1[i]*(1-mu) + v2[i] * mu;
    }
    return v3;
  },
  rgb: function(r,g,b) {
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    return 'rgb(' + r +','+g+','+b+')';
  },
  rgba: function(r,g,b,a) {
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);

    return 'rgba(' + r +','+g+','+b+','+a+')';
  },
  rgbaArray: function(v) {
    if(v.length == 4) {
      return Color.rgba(v[0],v[1],v[2],v[3]);
    } else {
      return Color.rgb(v[0],v[1],v[2]);
    }
  },
  linear: function(values) {
    var numSteps = values.length-1,
        stepSize = 1/numSteps;


    return function(t) {
      for (var i = 0; i < numSteps; i++) {
        var lower = stepSize * i,
            upper = lower + stepSize;
        if (t > lower && t <= upper) {
          var mu = (t-lower)/stepSize,
              rgb = Color.interpolate(values[i],values[i+1],mu),
              color = Color.rgbaArray(rgb);
          return color;
        }
      }
    };
  }
};