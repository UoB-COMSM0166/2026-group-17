class DrawUtils {

   constructor() {
      throw new Error("DrawUtils is a static utility class and cannot be instantiated.");
   }

   static drawLinearGradient(colorA, colorB) {
      strokeWeight(1);
      for (let i = 0; i < height; ++i) {
         stroke(lerpColor(colorA, colorB, i / height));
         line(0, i, width, i);
      }
   }
}