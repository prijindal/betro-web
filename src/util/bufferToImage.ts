import axios from "axios";

export const bufferToImageUrl = (buffer: Buffer): string => {
    var arrayBufferView = new Uint8Array(buffer);
    const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);
    return imageUrl;
};

export const imageUrlToBuffer = async (url: string): Promise<Buffer> => {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "utf-8");
    return buffer;
};
