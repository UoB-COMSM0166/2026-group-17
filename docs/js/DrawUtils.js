class DrawUtils {
    static drawLinearGradient(colorA, colorB) {
        strokeWeight(1);
        for (let i = 0; i < height; ++i) {
            stroke(lerpColor(colorA, colorB, map(i, 0, height, 0, 1)));
            line(0, i, width, i);
        }
    }
}