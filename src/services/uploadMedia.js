import multer from "multer";

export const uploadMedia = () => {
    const storage = multer.diskStorage({});

    const fileUpload = multer({storage});
    return fileUpload;
};