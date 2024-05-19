


export default function passwordValidate(password:string) {
    let errors = {
        password: ""
    };

    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 8) {
        errors.password = "Password must be 8 characters or more";
    } else if (password.length > 20) {
        errors.password = "Password must be 20 characters or less";
    } else if (!/(?=.*[0-9])/.test(password)) {
        errors.password = "Password must contain a number";
    } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
        errors.password = "Password must contain a special character";
    } else if (!/(?=.*[a-z])/.test(password)) {
        errors.password = "Password must contain a lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(password)) {
        errors.password = "Password must contain an uppercase letter";
    } else if (!/(?=.*[a-zA-Z])/.test(password)) {
        errors.password = "Password must contain a letter";
    } 

    if (errors.password === undefined || errors.password === "") {
        return {};
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}