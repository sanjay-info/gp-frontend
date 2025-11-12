const countryCodes = require('country-codes-list');

const getCountryCodeFromCallingCode = (countryCallingCode) => {
    const myCountryCodesObject = countryCodes.customList('countryCode', '[{countryCode}] {countryNameEn}: +{countryCallingCode}');

    for (const countryCode in myCountryCodesObject) {

        const callingCode = myCountryCodesObject[countryCode].split(': ')[1];

        if (callingCode === countryCallingCode) {
            return (countryCode).toLowerCase();
        }
    }
    return null;
};

export default getCountryCodeFromCallingCode;