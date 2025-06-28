"use client"

import style from "@/app/styles/TextingPanel.module.css"
import { Component, ReactElement, useEffect, useState } from "react";
import { makeTextIntervaled, post2json, TextIntervaledConfig } from "../client/util";
import { setDescriptionFinished, setSceneText } from "./ScenePanel";
import { SubmitArea } from "../common/SubmitArea";
import { setBackgroundImage } from "../page";

export var textID = 0;
const TEXT_INTERVAL = 50;

class TextStruct {
    text: string = "";
    textID: number = 0;
    sender: boolean = false; // false for model, true, for client

    public constructor(text: string, textID: number, sender: boolean) {
        this.text = text;
        this.textID = textID;
        this.sender = sender;
    }
}

export default function TextingPanel() {
    const [textComponents, setTextComponents] = useState(new Array<TextStruct>);

    function onSay() {
        console.log("submit");
    }

    useEffect(() => {
        post2json("http://localhost:3000/api/createConversation", {
            "generateContent": true
        }).then(res => {
            if (res == null) { return; }

            var sessionID = res; // TODO
            var data = res.data;
            
            console.log(data);
            if (data.generatedImage.length > 0) {
                setBackgroundImage(data.generatedImage);
            }

            setDescriptionFinished(() => {

                if (data.characterChatter != null && data.characterChatter.length > 0) {
                    setTextComponents([new TextStruct(data.characterChatter, textID++, false), ...textComponents]);
                }
            });

            setSceneText(data.sceneDescription);
        }); 
    }, []);
    
    return (
        <>
            <div id={style.TextingPanel}>
                <div id={style.Messages}>
                    { textComponents.map(e => <TextComponent key={`TextComponent-${e.textID}`} text={e.text} sender={e.sender}/> ) }
                </div>
                <SubmitArea placeholder="What do you say?" onSubmitCallback={onSay}/>
            </div>
        </>
    )
}


class TextComponentCallback {
    func: Function | null = null;
    public constructor(callback: Function | null) {
        this.func = callback;
    }
}

function TextComponent({text, sender}: any) {
    const [text_, setText] = useState("");
    const [intervaledText, setIntervaledText] = useState(text);
    const [intervaledCleanup, setIntervaledCleanup] = useState(new TextComponentCallback(null));

    var intervaledConfig = new TextIntervaledConfig();

    intervaledConfig.newTextCallback = (newText: string) => {
        setText(newText);
    }

    intervaledConfig.finishedCallback = () => {
        if (intervaledCleanup.func != null) { intervaledCleanup.func; }
    }

    useEffect(() => {
        var cleanup = makeTextIntervaled(intervaledText, intervaledConfig);
        
        setIntervaledCleanup(new TextComponentCallback(cleanup));

        return () => {
            if (intervaledCleanup.func != null) { intervaledCleanup.func(); }
        };
    }, [intervaledText]);

    return (
        <>
            <div className={sender ? style.sendTextDiv : style.receivedTextDiv}>
                <p className={style.textBody}>
                    { text_ }
                </p>
            </div>
        </>
    )
}