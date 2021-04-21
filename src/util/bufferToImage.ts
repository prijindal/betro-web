export const bufferToImageUrl = (buffer: Buffer): string => {
    var arrayBufferView = new Uint8Array(buffer);
    const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);
    return imageUrl;
};
