sketch.default2d();
var val = 0;
var vbrgb = [1.,1.,1.,0.];
var vfrgb = [1.,1.,1.,0.];
var vrgb2 = [1.,1.,1.,0.];
var last_x = 0;
var last_y = 0;

draw();

function draw()
{
  var theta;
  var width = box.rect[2] - box.rect[0];

  with (sketch) {
    shapeslice(180,1);
    // erase background
    glclearcolor(vbrgb[0],vbrgb[1],vbrgb[2],vbrgb[3]);
    glclear();
    moveto(0,1);
    lineto(0,-1);
  }
}

