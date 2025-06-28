"use server"


import { Chat, CreateChatParameters, GoogleGenAI, Modality, Type } from "@google/genai";
import { Conversation, getConversation, Message, Agent } from "./session";
import { promises as fs } from 'fs';

const AI = new GoogleGenAI({apiKey: process.env.GEMINI_KEY});
const SYSTEM_PROMPT = (await fs.readFile(process.cwd() + "/public/prompts/initial.txt", "utf8"));
const CHATS: Map<number, Chat> = new Map(); // transient

const INITIAL_CONFIG: CreateChatParameters = {
    model: "gemini-2.0-flash-lite",
    history: [
        {
            role: "user",
            parts: [{text: SYSTEM_PROMPT}]
        },
        {
            role: "model",
            parts: [{text: "Awaiting initial prompt"}]
        },
        
    ],
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                sceneDescription: {
                    type: Type.STRING
                },
                characterChatter: {
                    type: Type.STRING
                },
                characterChattedWithUser: {
                    type: Type.BOOLEAN
                },
                imageGenerated: {
                    type: Type.BOOLEAN
                },
                imageGenerationPrompt: {
                    type: Type.STRING
                }

            },
            propertyOrdering: ["sceneDescription", "characterChatter", "characterChattedWithUser", "imageGenerated", "imageGenerationPrompt"]
        }
    }
}

export async function generateNextContent(conversationID: number) {
    const CONVERSATION = getConversation(conversationID);

    if (CONVERSATION == null || CONVERSATION.currentTurn != Agent.Model) { return null; }

    var currentChat: Chat | undefined = undefined;
    
    if (CHATS.has(conversationID)) {
        currentChat = CHATS.get(conversationID);
    } else {
        currentChat = AI.chats.create(INITIAL_CONFIG);
        CONVERSATION.addUserText("SYSTEM_PROMPT: Generate the initial state of the game");
        CHATS.set(conversationID, currentChat);
    }

    var lastUserText: Message | null = CONVERSATION.getLastUserMessage();

    if (lastUserText == null) { return null; }

    const response = await currentChat?.sendMessage({message: lastUserText.message});
    
    if (response !== undefined && response.text !== undefined) {
        CONVERSATION.addModelText(response.text);
        CONVERSATION.userTurn();

        var data = JSON.parse(response.text);
        data.generatedImage = "";

        if (data.imageGenerated) {
            const imResp = await AI.models.generateContent({
                model: "gemini-2.0-flash-preview-image-generation",
                contents: data.imageGenerationPrompt,
                config: {
                    responseModalities: [Modality.TEXT, Modality.IMAGE],
                },
            });

            if (imResp.candidates !== undefined && imResp.candidates[0].content !== undefined
                && imResp.candidates[0].content.parts !== undefined
            ) { // christ
                for (const part of imResp.candidates[0].content?.parts) {
                    if (part.inlineData) {
                        data.generatedImage = part.inlineData.data;
                    }
                }
            }
            
        }

        return data;
    }

    return null;
}


export async function createChatFromConversation(conversation: Conversation) {

}