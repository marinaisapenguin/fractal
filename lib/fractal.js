(function(){
  if (typeof Fractal === "undefined") {
    window.mandelbrotFractal = {};
  }

  var Fractal = mandelbrotFractal.Fractal = function(width, height){
    // this.width = width;
    // this.height = height;
    this.cords = {
      pxWidth: width,
      pxHeight: height,
      xCartMin: -2.0,
      xCartMax: 2.0,
      yCartMin: -2.0,
      yCartMax: 2.0,
    };
    this.numColors = 1793;
    this.determineCords();
  };

  Fractal.prototype.draw = function(){

    console.log(this.cords);

    var imageData = new ImageData(this.cords.pxWidth, this.cords.pxHeight);
    for (var y = 0; y < imageData.height; y++){

      var yCart = this.pixelToCartY(y);

      for (var x = 0; x < imageData.width; x++){
        var xCart = this.pixelToCartX(x);

        var escapeTime = this.calcEscapeTime(xCart, yCart);


        var red = this.redNum(escapeTime);
        var green = this.greenNum(escapeTime);
        var blue = this.blueNum(escapeTime);

        // console.log(x + ", " + y + " - " + Math.round(xCart * 100) / 100 + ", " + Math.round(yCart * 100) / 100 + " - " + escapeTime + " - " + red + ", " + green + ", " + blue);

        var index = (y * imageData.width + x) * 4;
        imageData.data[index] = red;
        imageData.data[index + 1] = green;
        imageData.data[index + 2] = blue;
        imageData.data[index + 3] = 255;


        // imageData.data[index] = Math.floor(Math.random()*256);
        // imageData.data[index + 1] = Math.floor(Math.random()*256);
        // imageData.data[index + 2] = Math.floor(Math.random()*256);
        // imageData.data[index + 3] = 255;
      }
    }

    console.log("done draw");
    return imageData;
  };

  Fractal.prototype.start = function(ctx){
    ctx.font="100px Verdana";
    ctx.fillText("Loading...",100,100);

    setTimeout(function(){
      var imageData = this.draw();
      ctx.putImageData(imageData, 0, 0);
    }.bind(this), 60);
  };


  Fractal.prototype.determineCords = function(){
    var ctWidth = this.cords.xCartMax - this.cords.xCartMin;
    var ctHeight = this.cords.yCartMax - this.cords.yCartMin;
    var pxWidth = this.cords.pxWidth;
    var pxHeight = this.cords.pxHeight;

    if (ctHeight / ctWidth < pxHeight / pxWidth) {
      var oldCtHeight = ctHeight;
      ctHeight = ctWidth * (pxHeight / pxWidth);
      var diff = ctHeight - oldCtHeight;
      this.cords.yCartMax += diff / 2;
      this.cords.yCartMin -= diff / 2;
    } else {
      var oldCtWidth = ctWidth;
      ctWidth = ctHeight * (pxWidth / pxHeight);
      var diff = ctWidth - oldCtWidth;
      this.cords.xCartMax += (diff / 2);
      this.cords.xCartMin -= (diff / 2);
    }
  };

  Fractal.prototype.pixelToCartX = function(x){
    var pxRatio = x / this.cords.pxWidth;
    var cartWidth = this.cords.xCartMax - this.cords.xCartMin;
    return this.cords.xCartMin + (cartWidth * pxRatio);
  };

  Fractal.prototype.pixelToCartY = function(y){
    var pxRatio = y / this.cords.pxHeight;
    var cartHeight = this.cords.yCartMax - this.cords.yCartMin;
    return this.cords.yCartMin + (cartHeight * pxRatio);
  };


  Fractal.prototype.calcEscapeTime = function(xCart, yCart){
    var escapeTime = 0;
    var oldX = xCart;
    var oldY = yCart;
    var newX, newY;


    while (Math.sqrt(oldX * oldX + oldY * oldY) < 2 && escapeTime < this.numColors) {
      newX = (oldX * oldX) - (oldY * oldY) + xCart;
      newY = (2 * oldX * oldY) + yCart;

      oldX = newX;
      oldY = newY;

      escapeTime += 1;
    }

    return escapeTime;
  };

  // Fractal.prototype.distanceFromOrigin = function(x, y){
  //   return Math.sqrt(x * x + y * y);
  // };




  ///////////////////////////////////////////////////////////////////////////////
  //the next 3 funtions caculate the red, green and blue values for the given
  //escape time number and number of colors desired using a rainbow algorithim.
  //takes:
  //escape time number
  //number of colors
  //
  //rainbow algorithim:
  //start with 2 of the 3 values fixed at either 0 or 255,
  //then increase the other R, G or B value in a given number of increments
  //repeat this for seven cases and you get a maximum of 1793 colors (7*256 + 1)
  //the seven case are:
  //case 0: R=0, B=0, increase green from 0 to 255
  //case 1: R=0 G=255, increase blue from 0 to 255
  //case 2: G=255, B=255, increase red form 0 to 255
  //case 3: G=0, B=255, increase red from 0 to 255
  //case 4: R=255, B=255, increase green from 0 to 255
  //case 5: R=255, B=0, increase green from 0 to 255
  //case 6: R=255, G=255, increase blue from 0 to 255
  ///////////////////////////////////////////////////////////////////////////////

  Fractal.prototype.redNum = function(escapeTime){
    if (escapeTime === 0) {
      return Math.floor(Math.random()*256);
    }

    var redNum;
    var rgbIncrements = Math.floor(((this.numColors - 1) / 7));
    var caseNum = Math.floor(escapeTime / rgbIncrements);
    var remainNum = escapeTime % rgbIncrements;

    if (caseNum === 2 || caseNum === 3) {
      redNum = Math.floor((256 / rgbIncrements) * remainNum);
      // console.log(redNum);
    } else if (caseNum === 0 || caseNum === 1) {
      redNum = 0;
    } else {
      redNum = 255;
    }

    return redNum;
  };


  Fractal.prototype.greenNum = function(escapeTime){
    if (escapeTime < 2) {
      return Math.floor(Math.random()*256);
    }

    var greenNum;
    var rgbIncrements = Math.floor(((this.numColors - 1) / 7));
    var caseNum = Math.floor(escapeTime / rgbIncrements);
    var remainNum = escapeTime % rgbIncrements;

    if (caseNum === 0 || caseNum === 4 || caseNum === 5) {
      greenNum = Math.floor((256 / rgbIncrements) * remainNum);
      // console.log(greenNum);
    } else if (caseNum === 3) {
      greenNum = 0;
    } else {
      greenNum = 255;
    }

    return greenNum;
  };


  Fractal.prototype.blueNum = function(escapeTime){
    if (escapeTime < 3) {
      return Math.floor(Math.random()*256);
    }

    var blueNum;
    var rgbIncrements = Math.floor(((this.numColors - 1) / 7));
    var caseNum = Math.floor(escapeTime / rgbIncrements);
    var remainNum = escapeTime % rgbIncrements;

    if (caseNum === 1 || caseNum === 6) {
      blueNum = Math.floor((256 / rgbIncrements) * remainNum);
      // console.log(blueNum);
    } else if (caseNum === 0 || caseNum === 5) {
      blueNum = 0;
    } else {
      blueNum = 255;
    }

    return blueNum;
  };

})();
