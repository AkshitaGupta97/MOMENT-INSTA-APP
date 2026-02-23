
export const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();  // pre built browser API to read file, which convert file into BASE64  data url.
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

