/**
 * Returns  first name, last name and the last 4 digits of given phone number
 * ex:  jehf_doe_0000
 * @param {String} fisrtName 
 * @param {String} lastName 
 */
const fileName = (fisrtName, lastName, phoneNumber) =>
    `${fisrtName}_${lastName}_${phoneNumber.slice(6)}`.toLowerCase();;


export default fileName;