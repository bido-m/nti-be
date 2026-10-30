import crypto from "crypto";

export const otp = () => {
    return crypto.randomInt(100000,999999).toString();
}