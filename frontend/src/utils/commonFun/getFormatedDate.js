export function getFormatedDate(utcTimestamp) {
  // Create a Date object from the UTC timestamp
  const date = new Date(utcTimestamp);

  // Get the local time string using toLocaleString()
  const localTime = date.toLocaleString();

  return localTime;
}

//   const utcTimestamp = "2023-07-25T07:49:40.085Z";
//   const localTime = getFormatedDate(utcTimestamp);
//   console.log(localTime);
