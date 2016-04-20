## Mandelbrot fractal generator

http://rafrex.github.io/fractal

JavaScript app that draws the Mandelbrot fractal and allows you to zoom in and explore the fractal (uses zero libraries).

- Launches in fullscreen mode for maximum impact on desktop, and has a responsive mobile compatible design with a multi-touch interface on mobile devices.

- The coloring algorithm adjusts to the number of colors needed (i.e. the maximum escape time for the Mandelbrot set generation). See below for more info on the coloring algorithm.

- By default the maximum escape time is 224, but you can select 448, 896, or 1792 via the higher escape time links on the launch page. Note that if you zoom in on the fractal and exit back to the launch page, and then select a different escape time, it will launch and redraw the fractal in the same place that you had zoomed in on, just with a different maximum escape time (and different coloring).
