/**
 * Converts a temperature in Celsius to Fahrenheit
 * @param celsius The temperature in Celsius
 * @returns The temperature in Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Converts a temperature in Fahrenheit to Celsius
 * @param fahrenheit The temperature in Fahrenheit
 * @returns The temperature in Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
} 