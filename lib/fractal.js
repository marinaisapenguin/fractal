(function(){
  if (typeof Fractal === "undefined") {
    window.mandelbrotFractal = {};
  }

  var Fractal = mandelbrotFractal.Fractal = function(canvasEl, ctx, width, height, maxEscapeTime){
    this.canvasEl = canvasEl;
    this.ctx = ctx;
    this.cords = {
      pxWidth: width,
      pxHeight: height,
      xCartMin: -2.2,
      xCartMax: 0.7,
      yCartMin: -1.2,
      yCartMax: 1.2,
    };
    this.maxEscapeTime = maxEscapeTime; //225, 449, 897, max 1793
    this.determineCords();
  };




  Fractal.prototype.drawToImageData = function(){

    console.log(this.cords);

    var imageData = new ImageData(this.cords.pxWidth, this.cords.pxHeight); //OK? new each time? gets garbadge collected?
    for (var y = 0; y < imageData.height; y++){
      var yCart = this.pixelToCartY(y);

      for (var x = 0; x < imageData.width; x++){
        var xCart = this.pixelToCartX(x);
        var escapeTime = this.calcEscapeTime(xCart, yCart);

        // console.log(x + ", " + y + " - " + Math.round(xCart * 100) / 100 + ", " + Math.round(yCart * 100) / 100 + " - " + escapeTime + " - " + red + ", " + green + ", " + blue);

        var rgbNum = this.rgbNum(escapeTime);
        // var rgbNum = [Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*256)];
        // var rgbNum = [150, 150, 150];

        var index = (y * imageData.width + x) * 4;
        imageData.data[index] = rgbNum[0];
        imageData.data[index + 1] = rgbNum[1];
        imageData.data[index + 2] = rgbNum[2];
        imageData.data[index + 3] = 255;
      }
    }

    console.log(imageData.width);
    console.log(imageData.height);
    console.log("done drawToImageData");
    return imageData;
  };

  Fractal.prototype.zoomClick = function(x, y, zoomOut, reset){
    // console.log(this.cords);
    // debugger;

    if (reset) {
      this.cords.xCartMin = -2.2;
      this.cords.xCartMax = 0.7;
      this.cords.yCartMin = -1.2;
      this.cords.yCartMax = 1.2;

    } else {

      var diffRatio;
      if (zoomOut) {
        diffRatio = 2;
      } else {
        diffRatio = 0.1;
      }

      var diffPxWidth = Math.floor(this.cords.pxWidth * diffRatio);
      var diffPxHeight = Math.floor(this.cords.pxHeight * diffRatio);


      var newXCartMin = this.pixelToCartX(x - diffPxWidth);
      var newXCartMax = this.pixelToCartX(x + diffPxWidth);
      var newYCartMin = this.pixelToCartY(y - diffPxHeight);
      var newYCartMax = this.pixelToCartY(y + diffPxHeight);

      // debugger;

      this.cords.xCartMin = newXCartMin;
      this.cords.xCartMax = newXCartMax;
      this.cords.yCartMin = newYCartMin;
      this.cords.yCartMax = newYCartMax;
    }

    this.determineCords();
    // var imageData = this.drawToImageData();
    // this.ctx.putImageData(imageData, 0, 0);

  };


  Fractal.prototype.draw = function(imageData){
    if (imageData) {
      this.ctx.putImageData(imageData, 0, 0);
    } else {

      var pixels = this.cords.pxWidth * this.cords.pxHeight;
      this.ctx.font="2.5em Verdana";
      this.ctx.fillStyle = "#c0c0c0"
      this.ctx.fillText("Calculating " + pixels + " pixels...",300,300);

      setTimeout(function(){
        var imageData = this.drawToImageData();
        this.ctx.putImageData(imageData, 0, 0);
      }.bind(this), 30);
    }

    // var that = this;
    //
    // function clickHandler(event){
    //   var x = event.x * devicePixelRatio;
    //   var y = event.y * devicePixelRatio;
    //   // var x = event.x;
    //   // var y = event.y;
    //   that.zoomClick(x, y, event.altKey);
    // }
    //
    // this.canvasEl.addEventListener("click", clickHandler);
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

    while (Math.sqrt(oldX * oldX + oldY * oldY) < 2 && escapeTime < this.maxEscapeTime) {
      newX = (oldX * oldX) - (oldY * oldY) + xCart;
      newY = (2 * oldX * oldY) + yCart;

      oldX = newX;
      oldY = newY;

      escapeTime += 1;
    }

    return escapeTime;
  };



  ///////////////////////////////////////////////////////////////////////////////
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

  Fractal.prototype.rgbNum = function(escapeTime){
    if (escapeTime <= 2) {
      return [0, 0, 0];
    } else if (escapeTime === this.maxEscapeTime) {
      // return [255, 255, 255];
      // return [0, 0, 0];
      return [0, 25, 0];
      // return [0, 255, 0];
    }

    var redNum;
    var greenNum;
    var blueNum;
    var rgbIncrements = Math.floor(((this.maxEscapeTime - 1) / 7));
    var caseNum = Math.floor(escapeTime / rgbIncrements);
    var remainNum = escapeTime % rgbIncrements;

    switch (caseNum) {
      case 0:
        redNum = 0;
        greenNum = Math.floor((256 / rgbIncrements) * remainNum);
        blueNum = 0;
        break;
      case 1:
        redNum = 0;
        greenNum = 255;
        blueNum = Math.floor((256 / rgbIncrements) * remainNum);
        break;
      case 2:
        redNum = Math.floor((256 / rgbIncrements) * remainNum);
        greenNum = 255;
        blueNum = 255;
        break;
      case 3:
        redNum = Math.floor((256 / rgbIncrements) * remainNum);
        greenNum = 0;
        blueNum = 255;
        break;
      case 4:
        redNum = 255;
        greenNum = Math.floor((256 / rgbIncrements) * remainNum);
        blueNum = 255;
        break;
      case 5:
        redNum = 255;
        greenNum = Math.floor((256 / rgbIncrements) * remainNum);
        blueNum = 0;
        break;
      case 6:
        redNum = 255;
        greenNum = 255;
        blueNum = Math.floor((256 / rgbIncrements) * remainNum);
        break;
    }

    return [redNum, greenNum, blueNum];
  };

})();
