import { resize } from 'imagemagick';
import { tmpdir } from 'os';

export async function resizeImage(image: string, size: { width: number; height: number }) {
  const tmpImageName = `${tmpdir}/resizedImage`;
  return new Promise<string>((resolve, reject) => {
    resize({ width: size.width, height: size.height, srcData: image, dstPath: tmpImageName }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(tmpImageName);
      }
    });
  });
}
