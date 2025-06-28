"use server"

import { NextRequest } from "next/server";
import { createSession } from "../session";
import { generateNextContent } from "../gen";

export async function POST(obj: NextRequest) {
    var body = await obj.json();
    var newSessionID = createSession();

    if (body.generateContent) {
        return Response.json({sessionID: newSessionID, data: await generateNextContent(newSessionID)});    
    }

    return Response.json({sessionID: newSessionID, data: {}});
}