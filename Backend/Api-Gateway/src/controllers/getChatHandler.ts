import { Request,Response } from "express";
import axios from "axios";

export const getChatHandler = async (req:Request,res:Response)=>{
    let {participant1Id,participant2Id} = req.params
          participant1Id = participant1Id.trim().toLowerCase();
          participant2Id = participant2Id.trim().toLowerCase();
    try {
        const chats = await axios.get('http://localhost:2211/getChats',{
            params:{participant1Id,participant2Id}
        })
        console.log(chats);
    } catch (error) {
        console.log(`Error getting chats for paeticipants: ${participant1Id} and ${participant2Id} ERROR:${error}`)
    }
}