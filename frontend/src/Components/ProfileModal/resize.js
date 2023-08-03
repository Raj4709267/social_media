export function generateThumbnailUrl(originalImageUrl, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let newWidth = img.width;
      let newHeight = img.height;

      if (img.width > maxWidth) {
        newWidth = maxWidth;
        newHeight = (img.height * maxWidth) / img.width;
      }

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = (img.width * maxHeight) / img.height;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          const thumbnailUrl = URL.createObjectURL(blob);
          resolve(thumbnailUrl);
        },
        "image/jpeg",
        0.8
      );
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = originalImageUrl;
  });
}
