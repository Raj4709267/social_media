export function getFirstName(inputName) {
  // Check if the input is a string and non-empty
  if (typeof inputName !== "string" || inputName.trim().length === 0) {
    return ""; // Return an empty string if the input is not valid
  }

  // Split the full name into an array of words
  const words = inputName.trim().split(/\s+/);

  // Get the first word (first name)
  const firstName = words[0];

  // Capitalize the first letter and make the rest lowercase
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  return capitalizedFirstName;
}
