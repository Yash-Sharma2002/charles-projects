/**
 * Common fields used in the response
 * @readonly
 */
enum CommonFields {
  Id = "Id is required",
  Name = "Name is required",
  NameLength = "Name must be at most 50 characters long",
  NameMinLength = "Name must be at least 5 characters long",
  Username = "Username is required",
  UsernameLength = "Username must be at most 50 characters long",
  UsernameMinLength = "Username must be at least 5 characters long",
  Admin = "Admin is required",
  Image = "Image is required",
  ImageInvalid = "Image is invalid",
  Description = "Description is required",
  DescriptionMinLength = "Description must be at least 10 characters long",
  Email = "Email is required",
  EmailInvalid = "Email is invalid",
  EmailLength = "Email must be at most 50 characters long",
  EmailMinLength = "Email must be at least 5 characters long",
  Website = "Website is required",
  WebsiteInvalid = "Website is invalid",
  WebsiteLength = "Website must be at most 50 characters long",
  Phone = "Phone is required",
  PhoneInvalid = "Phone is invalid",
  PhoneLength = "Phone must be at most 20 characters long",
  Address = "Address is required",
  Type = "Type is required",
  Status = "Status is required",
  StatusInvalid = "Status is invalid",
  Role = "Role is required",
  Password = "Password is required",
  PasswordLength = "Password must be at most 20 characters long",
  PasswordMinLength = "Password must be at least 10 characters long",
  PasswordSpecialCharacter = "Password must contain at least one special character",
  PasswordUppercase = "Password must contain at least one uppercase letter",
  PasswordLowercase = "Password must contain at least one lowercase letter",
  PasswordNumber = "Password must contain at least one number",
  PasswordSpace = "Password must not contain any spaces",
  Country = "Country is required",
  CountryNotValid = "Country is not valid",
  State = "State is required",
  PostalCode = "Postal Code is required",
  PostalCodeInvalid = "Postal Code is invalid",
  City = "City is required",
  CityLength = "City must be at most 50 characters long",
  CityMinLength = "City must be at least 5 characters long",
  AddressLine1 = "Address Line1 is required",
  AddressLine1Length = "Address Line1 must be at most 50 characters long",
  AddressLine1MinLength = "Address Line1 must be at least 5 characters long",
}

export default CommonFields;
