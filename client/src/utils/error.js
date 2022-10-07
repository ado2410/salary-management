export const handleError = (err) => {
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const newErrors = {};
        newErrors[field] = {message: "Đã tồn tại"};
        return newErrors;
    }
    return err.errors || {};
}