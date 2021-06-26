# GNU JSIM DOCS

## How to use: 

Click the icons to change the tool type. 

The default tool is the `brush`, which has 5 states:

1. `Pen` (Default): This behaves like a normal pen.
2. `Pencil`: This behaves exactly like the pen. Someday I'm gonna change that.
3. `Splatter`: This, well, makes a random amount of dots of a random size on the canvas.
4. "`Wied`": This is a failed version of the splatter brush. It makes weird round-edged squares of random size.
5. "`Wieder`": This is a weirder version of "`Wied`", also a failed splatter brush. What it draws looks too weird to describe.

Other tools include:
1. `Eraser`: This behaves in the same way as the pen, but you cannot change its color (#dcdcdc) and is twice the size of the pen.
2.  `Text`: This adds text at the requested X and Y coords when clicked, then returns to the brush. If clicked when the X and/or Y and/or text fields are empty, it flashes an error message and returns to the brush, but *it continues drawing even when the mouse is not pressed*.
3. `Rectangle`: This draws a rectangle of the requested width and height at the requested X and Y, which is the top-right corner of the rectangle.
4. `Ellipse`: This draws an ellipse of the requested width and height at the requested X and Y, which is the centre of the ellipse.
5. `Fill`: This fills the *drawing* area of the canvas with the pen color. Note that the eraser erases the filled color.

Click any of the 6 colored boxes at the top-right corner to change the pen color.

Modify `drawingCanvasWidth` and `drawingCanvasHeight` to change the height and width of the drawing canvas.

The unobsfucated code can be requested by pinging AV3_08#5078 on Discord.