import CryptoJS from 'crypto-js';

const encryptData = (plainText, key) => {
    // Decode the Base64 key
    const ivString = process.env.REACT_APP_IV_KEY;
    const keyBytes = CryptoJS.enc.Base64.parse(key);

    // Convert IV string to WordArray
    const iv = CryptoJS.enc.Utf8.parse(ivString);

    // Encrypt the data
    const encryptedData = CryptoJS.AES.encrypt(
        plainText,
        keyBytes,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    ).toString();

    return encryptedData;
};

export default encryptData;