export function generateTransactionId(){
    return 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export function isSuccess(cardNumber : string , expiry : string , cvv : string , transcationId : string ,userId :string) : boolean{
    if(cardNumber && expiry && cvv){
        return true;
    }

    return false;
}


export function encryptText(text: string): string {
    const shift = 3; // Shifting each character by 3 positions (you can change this value)
    let encryptedText = '';
  
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const encryptedChar = String.fromCharCode(charCode + shift); 
      encryptedText += encryptedChar;
    }
  
    return encryptedText;
  }


  

