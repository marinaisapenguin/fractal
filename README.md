## Mandelbrot fractal generator

http://rafrex.github.io/fractal

JavaScript app that draws the Mandelbrot fractal and allows you to zoom in and explore the fractal (uses zero libraries).

- Launches in fullscreen mode for maximum impact on desktop, and has a responsive mobile compatible design with a multi-touch interface on mobile devices.

- The coloring algorithm adjusts to the number of colors needed (i.e. the maximum escape time for the Mandelbrot set generation). See below for more info on the coloring algorithm.

- By default the maximum escape time is 224, but you can select 448, 896, or 1792 via the higher escape time links on the launch page. Note that if you zoom in on the fractal and exit back to the launch page, and then select a different escape time, it will launch and redraw the fractal in the same place that you had zoomed in on, just with a different maximum escape time (and different coloring).


#### Coloring algorithm
Start with 2 of the 3 red, green and blue values fixed at either 0 or 255, then increase the other R, G or B value in a given number of increments based on the number of colors needed, repeat this for seven cases and you get a maximum of 1792 colors (7*256). Note that white repeats 3 times, at the end of cases 2, 4 and 6.

The seven case are:  
case 0: R=0, B=0, increase green from 0 to 255  
case 1: R=0 G=255, increase blue from 0 to 255  
case 2: G=255, B=255, increase red form 0 to 255  
case 3: G=0, B=255, increase red from 0 to 255  
case 4: R=255, B=255, increase green from 0 to 255  
case 5: R=255, B=0, increase green from 0 to 255  
case 6: R=255, G=255, increase blue from 0 to 255

```js
Fractal.prototype.rgbNum = function(escapeTime){
  if (escapeTime <= 2) {
    //pin all escape times less than 3 to black
    return [0, 0, 0];
  } else if (escapeTime === this.maxEscapeTime) {
    //normally this would be white, but that's too much white, so override
    return [0, 25, 0];
  }

  var redNum;
  var greenNum;
  var blueNum;
  var rgbIncrements = Math.floor(((this.maxEscapeTime) / 7));
  var caseNum = Math.floor(escapeTime / rgbIncrements);
  var remainNum = escapeTime % rgbIncrements;

  switch (caseNum) {
    case 0:
      redNum = 0;
      greenNum = Math.floor(256 / rgbIncrements) * remainNum;
      blueNum = 0;
      break;
    case 1:
      redNum = 0;
      greenNum = 255;
      blueNum = Math.floor(256 / rgbIncrements) * remainNum;
      break;
    case 2:
      redNum = Math.floor(256 / rgbIncrements) * remainNum;
      greenNum = 255;
      blueNum = 255;
      break;
    case 3:
      redNum = Math.floor(256 / rgbIncrements) * remainNum;
      greenNum = 0;
      blueNum = 255;
      break;
    case 4:
      redNum = 255;
      greenNum = Math.floor(256 / rgbIncrements) * remainNum;
      blueNum = 255;
      break;
    case 5:
      redNum = 255;
      greenNum = Math.floor(256 / rgbIncrements) * remainNum;
      blueNum = 0;
      break;
    case 6:
      redNum = 255;
      greenNum = 255;
      blueNum = Math.floor(256 / rgbIncrements) * remainNum;
      break;
  }

  return [redNum, greenNum, blueNum];
};
```
