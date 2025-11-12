import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

let modelsLoaded = null;

export const loadModel = async () => {
    await tf.setBackend('cpu'); // Force CPU backend
    await tf.ready(); // Wait until TensorFlow.js is ready
    modelsLoaded = await blazeface.load();
};

export const detectFace = async (imageSrc) => {
    if (!modelsLoaded) {
        console.error('Blazeface model is not loaded yet!');
        return -1; // Return -1 to indicate model not loaded
    }

    const img = new Image();
    img.src = imageSrc;

    return new Promise((resolve, reject) => {
        img.onload = async () => {
            const tensor = tf.browser.fromPixels(img);
            const predictions = await modelsLoaded.estimateFaces(tensor);
            tensor.dispose(); // Dispose tensor to free up memory

            if (!predictions || predictions.length === 0) {
                resolve(0); // No faces detected
            } else {
                resolve(predictions.length); // Return number of faces detected
            }
        };

        img.onerror = (err) => {
            reject(err); // Handle image load errors
        };
    });
};