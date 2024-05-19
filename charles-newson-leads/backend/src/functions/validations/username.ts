

export default function usernameValidate(username:string) {
    let errors = {
        username: ""
    };

    if (!username) {
        errors.username = "Username is required";
    }

    if (username.length < 3) {
        errors.username = "Username must be at least 3 characters long";
    }

    if (username.length > 20) {
        errors.username = "Username must be at most 20 characters long";
    }


    if (errors.username === undefined || errors.username === "") {
        return {};
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}