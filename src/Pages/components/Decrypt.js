import CryptoJS from 'crypto-js';

const decryptData = (encryptedData, key) => {
    // Decode the Base64 key

    const ivString = process.env.REACT_APP_IV_KEY

    const keyBytes = CryptoJS.enc.Base64.parse(key);

    // Convert IV string to WordArray
    const iv = CryptoJS.enc.Utf8.parse(ivString);

    // Decrypt the data
    const decryptedData = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(encryptedData) },
        keyBytes,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    ).toString(CryptoJS.enc.Utf8);

    return decryptedData;
};

export default decryptData