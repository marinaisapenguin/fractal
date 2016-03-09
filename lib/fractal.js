(function(){
  if (typeof Fractal === "undefined") {
    window.mandelbrotFractal = {};
  }

  var Fractal = mandelbrotFractal.Fractal = function(width, height){
    this.width = width;
    this.height = height;
  };

  Fractal.prototype.draw = function(ctx){
    // ctx.fillRect(25,25,100,100);
    // var myImageData = ctx.createImageData(1, 1);
    // // var myImageData = ctx.getImageData(0, 0, this.dimX, this.dimY);
    // // debugger;
    // var d  = myImageData.data;
    // d[0] = 0;
    // d[1] = 0;
    // d[2] = 0;
    // d[3] = 255;
    //
    // for (var i = 0; i < this.width; i++){
    //   if (i % 2 === 0) {
    //     d[0] = 150;
    //     d[1] = 0;
    //     d[2] = 0;
    //   } else {
    //     d[0] = 255;
    //     d[1] = 255;
    //     d[2] = 255;
    //   }
    //
    //   for(var j = 0; j < this.height; j++) {
    //     ctx.putImageData(myImageData, i, j);
    //   }
    // }

    var imageData = new ImageData(this.width, this.height);
    for (var y = 0; y < this.height; y++){
      for (var x = 0; x < imageData.width; x++){
        var index = (y * imageData.width + x) * 4;
        imageData.data[index] = Math.floor(Math.random()*256);
        imageData.data[index + 1] = Math.floor(Math.random()*256);
        imageData.data[index + 2] = Math.floor(Math.random()*256);
        imageData.data[index + 3] = 128;
      }
    }

    // debugger;
    ctx.putImageData(imageData, 0, 0);

  };

  Fractal.prototype.start = function(ctx){
    this.draw(ctx);
  };

})();
