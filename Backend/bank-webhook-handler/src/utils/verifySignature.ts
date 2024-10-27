    import * as crypto from 'crypto';

    export const  verifySignature = (payload:string,signature:string,secret:string)=> {
    const computedSignature = crypto.createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
        console.log("Computed Signature:", computedSignature);
        console.log("Received Signature:", signature);
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature));
    }