export function getLimitedText(str, maxLength = 10) {
  if (!str) {
    return null;
  }
  if (str?.length <= maxLength) {
    return str;
  } else {
    return str.slice(0, maxLength) + "...";
  }
}
