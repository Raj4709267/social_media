export function getFormantedName(name) {
  if (typeof name !== "string" || name.length === 0) {
    return name;
  }

  const words = name.split(" ");
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  });

  return capitalizedWords.join(" ");
}

// // Test the function
// const name = "john DOE";
// const capitalized = getFormantedName(name);
// console.log(capitalized); // Output: "John Doe"
