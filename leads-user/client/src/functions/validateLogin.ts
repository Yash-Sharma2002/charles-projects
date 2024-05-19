import setError from "./setError";


export default function validateLogin(user:{user:string,password:string}){
    
      if (user.user === undefined || user.user === "") {
        return setError("Email is required", "user");
      }
      if (!/\S+@\S+\.\S+/.test(user.user)) {
        return setError("Email address is invalid", "user");
      }
      if (user.password === undefined || user.password === "") {
        return setError("Password is required", "password");
      }
      if (user.password.length < 8) {
        return setError("Password must be at least 8 characters", "password");
      }
      if (user.password.length > 20) {
        return setError("Password must be less than 20 characters", "password");
      }
      if (!/(?=.*[0-9])/.test(user.password)) {
        return setError("Password must contain a number", "password");
      }
      if (!/(?=.*[!@#$%^&*])/.test(user.password)) {
        return setError("Password must contain a special character", "password");
      }
      if (!/(?=.*[a-z])/.test(user.password)) {
        return setError("Password must contain a lowercase letter", "password");
      }
      if (!/(?=.*[A-Z])/.test(user.password)) {
        return setError("Password must contain an uppercase letter", "password");
      }
      if (!/(?=.*[a-zA-Z])/.test(user.password)) {
        return setError("Password must contain a letter", "password");
      }
      return setError("", "", false);

}