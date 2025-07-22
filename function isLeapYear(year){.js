function isLeapYear(year){
if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
  return `${year} is a leap year`;
} else
{
  return `${year} is not a leap year`;
}
}
const year=2024;
const  result =isLeapYear(year);

console.log(result);
console.log(isLeapYear(2000));
console.log(isLeapYear(1900)); 






function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + '...';
    }
    return str;
}

// Test cases
console.log(truncateString("Hello world", 5));  // "Hello..."
console.log(truncateString("JavaScript", 10));  // "JavaScript" (unchanged)
console.log(truncateString("Short", 3));       // "Sho..."
console.log(truncateString("Test", 4));        // "Test" (unchanged)
console.log(truncateString("", 2));            // "" (empty string)