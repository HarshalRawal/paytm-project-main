export function validateAndExtractNumber(upiId: string): string | null {
    // Define the regex pattern to match the UPI format (number@easypay)
    const pattern = /^(\d+)@easypay$/;

    // Test if the UPI ID matches the pattern
    const match = upiId.match(pattern);

    if (match) {
        // If there's a match, the first capturing group contains the number
        return match[1];
    } else {
        // Return null if the format is invalid
        return null;
    }
}
