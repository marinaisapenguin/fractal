(function(){
  if (typeof window.mandelbrotFractal === "undefined") {
    window.mandelbrotFractal = {};
  }
  window.mandelbrotFractal.App = App;


  function App(){
    this.elements = {};
    this.getElements();
    this.fractal = new mandelbrotFractal.Fractal(this.elements.fractalCanvas);
    this.fullscreenSupported = this.determineFullscreenSupport();
    this.isTouchDevice = this.determineTouch();
    this.addEventListeners();
    this.fractalOptions = {};
    this.initialSetup();
  }


  App.prototype.determineTouch = function(){
    return false;
  };


  App.prototype.initialSetup = function(){
    this.fractalOptions.defaults = true;
    this.updateFractal();
  };


  App.prototype.updateFractalSize = function(){
    var width, height;

    if (this.fullscreenSupported) {
      width = screen.width;
      height = screen.height;
    } else {
      //important - use clientWidth/Height instead of innerWidth/Height
      //when zoomed in on mobile device, clientWidth/Height will be the
      //full size of the browser window (same as when not zoomed in),
      //while the innerWidth/Height will be the much smaller cropped size
      //that's zoomed in on
      width = document.documentElement.clientWidth;
      height = document.documentElement.clientHeight;
    }

    this.elements.fractalCanvas.setAttribute(
      "style", "width: " + width + "px; height: " + height + "px;"
    );

    this.fractalOptions.pxWidth = width * devicePixelRatio;
    this.fractalOptions.pxHeight = height * devicePixelRatio;
  };


  App.prototype.getElements = function(){
    var els = this.elements;
    els.launchPage = document.getElementById("launch-page");
    els.launchFractal = document.getElementById("launch-fractal");
    els.launchDetailedFractal = document.getElementById("launch-detailed-fractal");
    els.fractalGraphics = document.getElementById("fractal-graphics");
    els.fractalCanvas = document.getElementById("fractal-canvas");
    els.fractalInfo = document.getElementById("fractal-info");
    els.loadingFractal = document.getElementById("loading-fractal");

    els.test = document.getElementById("credit-line");
  };


  App.prototype.addEventListeners = function(){
    var els = this.elements;
    var evFuncs = this.eventFunctions;
    els.launchFractal.addEventListener("click", evFuncs.launchFractal.bind(this));
    els.launchDetailedFractal.addEventListener("click", evFuncs.launchDetailedFractal.bind(this));
    els.fractalCanvas.addEventListener("click", evFuncs.zoom.bind(this));

    if (document.fullscreenEnabled) {
        document.addEventListener("fullscreenchange", evFuncs.fullscreenChange.bind(this));
        //note this might not work in ms edge, which uses "fullscreenChange",
        //but responds to document.fullscreenEnabled, so add second event listener for now...
        document.addEventListener("fullscreenChange", evFuncs.fullscreenChange.bind(this));
    } else if (document.webkitFullscreenEnabled) {
        document.addEventListener("webkitfullscreenchange", evFuncs.fullscreenChange.bind(this));
    } else if (document.mozFullScreenEnabled) {
        document.addEventListener("mozfullscreenchange", evFuncs.fullscreenChange.bind(this));
    } else if (document.msFullscreenEnabled) {
        document.addEventListener("MSFullscreenChange", evFuncs.fullscreenChange.bind(this));
    }

    els.test.addEventListener("click", evFuncs.test.bind(this));
    // els.test.addEventListener("click", evFuncs.launchFractal.bind(this)); //test - can overload el event w/ multiple listeners
  };


  App.prototype.eventFunctions = {

    launchFractal: function(){
      this.showFractal(225);
    },

    launchDetailedFractal: function(){
      this.showFractal(1793);
    },

    zoom: function(event){
      this.fractalOptions = {zoomInPxPoint: {}};
      this.fractalOptions.zoomInPxPoint.xPx = event.offsetX * devicePixelRatio;
      this.fractalOptions.zoomInPxPoint.yPx = event.offsetY * devicePixelRatio;
      this.updateFractal();
    },

    fullscreenChange: function(){
      if (!this.inFullscreenMode()) {
        this.hideFractal();
      }
    },

    exitFractal: function(){
      if (this.inFullscreenMode()) {
        this.exitFullscreenMode();
      } else {
        this.hideFractal();
      }
    },


    test: function(){
      console.log(this);
    }
  };


  App.prototype.hideFractal = function(){
    this.elements.fractalGraphics.style.display = "none";
    this.elements.launchPage.style.display = "block";
  };


  App.prototype.showFractal = function(maxEscapeTime){
    this.elements.launchPage.style.display = "none";
    this.elements.fractalGraphics.style.display = "block";
    if (this.fullscreenSupported) {
      this.enterFullscreenMode(this.elements.fractalGraphics);
    }

    this.fractalOptions.maxEscapeTime = maxEscapeTime;

    this.elements.loadingFractal.style.display = "block";


    //to allow the transition of show/hide/enterfullscreen to happen before
    //the fractal starts drawing (which can freeze the browser in the middle
    //of transistions) - is there a command to not draw until transitions
    //are finished (including brower's enter fullscreen mode transition)?
    setTimeout(function(){
      this.updateFractal();
    }.bind(this), 300);
  };

  App.prototype.updateFractal = function(){
    this.elements.loadingFractal.style.display = "block";

    //hack workaround so the loading fractal div is rendered before the fractal
    //is starts drawing
    setTimeout(function(){
      this.updateFractalSize();
      this.fractal.update(this.fractalOptions);
      this.fractalOptions = {};

      setTimeout(function(){
        //hack workaround b/c additional click events while drawing fractal
        //aren't registered by browser until after done drawing,
        //so this timeout is needed so the additional clicks, which should do
        //nothing, are registered on the #loading-fractal div before it is hidden
        //and not on the canvas, which would cause another zoom
        this.elements.loadingFractal.style.display = "none";
        // this.loading = false;
      }.bind(this), 200);
    }.bind(this), 200);
  };


  //fullscreen functions:

  App.prototype.determineFullscreenSupport = function(){
    if (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    ) {
      return true;
    }
    return false;
  };


  App.prototype.inFullscreenMode = function(){
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      return true;
    }
    return false;
  };


  App.prototype.exitFullscreenMode = function(){
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
  };


  App.prototype.enterFullscreenMode = function(element){
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
  };

})();
