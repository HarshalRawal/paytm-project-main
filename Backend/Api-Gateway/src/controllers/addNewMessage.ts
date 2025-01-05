import { Request,Response } from "express";
import axios from "axios";

const addNewMessages = async(req:Request,res:Response)=>{
  const {participant1Id,participant2Id} = req.params
  try {
    const respone = await axios.post('http://localhost:2211/addNewMessages',{
        participant1Id,
        participant2Id
    })
  } catch (error) {
    console.log("Error adding new Message for new")
  }
}