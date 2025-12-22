import CryptoJS from 'crypto-js';

const decryptData = (encryptedData, key) => {
    try {
        // Prevent null / undefined / empty errors
        if (!encryptedData || encryptedData === "" || encryptedData === "null") {
            return "";
        }

        const ivString = process.env.REACT_APP_IV_KEY;

        // Prevent key errors
        if (!key || key === "") {
            console.error("decryptData error: missing key");
            return "";
        }

        const keyBytes = CryptoJS.enc.Base64.parse(key);
        const iv = CryptoJS.enc.Utf8.parse(ivString);

        const decryptedData = CryptoJS.AES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(encryptedData) },
            keyBytes,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        ).toString(CryptoJS.enc.Utf8);

        return decryptedData || "";
    } catch (err) {
        console.error("decryptData failed:", err);
        return "";
    }
};

export default decryptData;
