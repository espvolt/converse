export enum Agent {
    User,
    Model
}
export class Message {
    role: Agent = Agent.Model;
    message: string = "none";
    
    b64Im: string = "";
    sceneDescription: string = "";
    characterChatter: string = "";

    public constructor(message: string, role: Agent) {
        this.message = message;
        this.role = role;
    }

    public static modelMessage(sceneDescription: string, characterChatter: string, b64Im: string="") {
        var msg = new Message("", Agent.Model);

        msg.sceneDescription = sceneDescription;
        msg.characterChatter = characterChatter;

        b64Im = b64Im;

        return msg;
    }
}

export class Conversation {
    messages: Array<Message> = [];
    currentTurn: Agent = Agent.Model; 

    public addUserText(text: string) {
        var msg = new Message(text, Agent.User);

        this.messages.push(msg);
    } 

    public addModelText(text: string) {
        var msg = new Message(text, Agent.Model);

        this.messages.push(msg);
    }

    public getLastUserMessage() {
        if (this.messages.length == 0) { return null; }
        
        var lastMessage = this.messages[this.messages.length - 1];

        for (var i = this.messages.length - 1; i >= 0; i++) {
            if (lastMessage.role == Agent.User) {
                return lastMessage;
            }
        }
        
        return null;
    }

    public modelTurn() {
        this.currentTurn = Agent.Model;
    }

    public userTurn() {
        this.currentTurn = Agent.User;
    }
}

export var CONVERSATIONS: Map<number, Conversation> = new Map();
var currentSessionID = 0;

export function createSession() {
    CONVERSATIONS.set(currentSessionID, new Conversation());

    return currentSessionID++;
}

export function getConversation(sessionID: number) {
    return CONVERSATIONS.get(sessionID);
}

