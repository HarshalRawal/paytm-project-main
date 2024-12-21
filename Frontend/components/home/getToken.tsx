"use server"
import { cookies } from "next/headers"

export const isToken = ()=>{
    const token = cookies().get('auth_token');
    if(token && token != null){
        return true;
    }
    return false;
}