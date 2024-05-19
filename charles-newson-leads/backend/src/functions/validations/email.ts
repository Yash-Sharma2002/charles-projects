

export default function emailValidate(email:string) {
    let errors = {
        email: ""
    };

    if (!email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Email is invalid";
    } else if (email.length > 50) {
        errors.email = "Email must be at most 50 characters long";
    } else if (email.length < 5) {
        errors.email = "Email must be at least 5 characters long";
    }
    if (errors.email === undefined || errors.email === "") {
        return {};
    }
    
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}