
export function decryptText(text: string): string {
    const shift = 3; 
    let decryptedText = '';
  

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const decryptedChar = String.fromCharCode(charCode - shift); 
      decryptedText += decryptedChar;
    }
  console.log('reached');
  
    return decryptedText;
}
