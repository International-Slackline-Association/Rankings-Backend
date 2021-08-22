import * as sharp from 'sharp';

export async function resizeImage(imageBuffer: string, size: { width: number; height: number }) {
 return sharp(imageBuffer)
    .rotate()
    .resize(size.width, size.height)
    .toBuffer();
}
