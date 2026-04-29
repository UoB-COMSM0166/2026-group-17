// store for static utility methods that need to be available across different classes
class DrawUtils {

   constructor() {
      throw new Error("DrawUtils is a static utility class and cannot be instantiated");
   }

   static drawLinearGradient(colorA, colorB) {
      strokeWeight(1);
      for (let i = 0; i < height; ++i) {
         stroke(lerpColor(colorA, colorB, i / height));
         line(0, i, width, i);
      }
   }

   // draw a rounded rectangle with current fill and stroke styles
   // used for glass panels and cards' glass effect in weapon shop
   static glassRect(x, y, w, h, r) {
      drawingContext.beginPath();
      drawingContext.moveTo(x + r, y);
      drawingContext.lineTo(x + w - r, y);
      drawingContext.quadraticCurveTo(x + w, y, x + w, y + r);
      drawingContext.lineTo(x + w, y + h - r);
      drawingContext.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      drawingContext.lineTo(x + r, y + h);
      drawingContext.quadraticCurveTo(x, y + h, x, y + h - r);
      drawingContext.lineTo(x, y + r);
      drawingContext.quadraticCurveTo(x, y, x + r, y);
      drawingContext.closePath();
      if (drawingContext.fillStyle && drawingContext.fillStyle !== 'rgba(0, 0, 0, 0)') {
         drawingContext.fill();
      }
      if (drawingContext.strokeStyle && drawingContext.strokeStyle !== 'rgba(0, 0, 0, 0)') {
         drawingContext.stroke();
      }
   }
}