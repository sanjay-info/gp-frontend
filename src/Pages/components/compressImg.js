import Compressor from 'compressorjs';

const compressImg = (file) => {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: 0.6,
            success: (compressedResult) => {
                // Create a FileReader to convert the compressedResult to Base64
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64String = e.target.result; // Get Base64 string
                    resolve({
                        compressedFile: compressedResult,
                        base64String: base64String
                    }); // Return both the compressed file and base64
                };
                reader.onerror = (err) => {
                    console.error("Base64 Conversion Error:", err);
                    reject(err);
                };
                reader.readAsDataURL(compressedResult); // Convert compressed file to Base64
            },
            error: (err) => {
                console.error("Compression Error:", err);
                reject(err);
            }
        });
    });
};

export default compressImg;