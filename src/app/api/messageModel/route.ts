import { generateNextContent } from "../gen";
import { getConversation, Message } from "../session";

export async function POST(req: Request) {
    const body = await req.json();
    const CONVERSATION = getConversation(body.conversationID);

    if (CONVERSATION == null || !CONVERSATION.currentTurn) { return Response.error(); }

    CONVERSATION.addUserText(body.message);
    CONVERSATION.modelTurn();

    if (body.generateContent) {
        return Response.json({success: true, text: await generateNextContent(body.conversationID)});
    }

    return Response.json({success: true, text: ""});
}