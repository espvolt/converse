"use client"

import { useEffect, useState } from "react";
import style from "@/app/styles/ScenePanel.module.css";
import { makeTextIntervaled, TextIntervaledConfig } from "../client/util";
import { SubmitArea } from "../common/SubmitArea";
import { showHelpPanel } from "../page";

var triggerSceneChange: Function | null = null;
var currentCleanupFunction: Function | null = null;
var sceneDescriptionFinished: Function | null = null;

class TextStateStruct {
    index: number = 0;
    text: string = "";

    public constructor(text: string, index: number=0) {
        this.text = text;
        this.index = index;
    }
}

export function setSceneText(text: string) {
    if (triggerSceneChange != null) {
        triggerSceneChange(text);
    }
}

export function setDescriptionFinished(val: Function) {
    sceneDescriptionFinished = val;
}

export function ScenePanel({initialText}: any) {
    const [text, setText] = useState(initialText);
    const [intervaledText, setIntervaledText] = useState(initialText);
    
    triggerSceneChange = (text: string) => {
        if (currentCleanupFunction != null) {
            currentCleanupFunction();
        }
        
        setIntervaledText(text);
    }

    const intervaledConfig: TextIntervaledConfig = new TextIntervaledConfig();
    
    intervaledConfig.newTextCallback = (text: string) => {
        setText(text);
    }

    intervaledConfig.finishedCallback = () => {
        console.log("im finished bruh wtf")
        if (sceneDescriptionFinished != null) { sceneDescriptionFinished(); }
    }

    useEffect(() => {
            currentCleanupFunction = makeTextIntervaled(intervaledText, intervaledConfig);
            
            return () => {
                currentCleanupFunction!();
            };
        }
    , [intervaledText]);

    return (
        <div id={style.ScenePanel}>
                <div id={style.ScenePanelSeperator}>
                    <div id={style.SceneText}>
                        <p>
                            {text}
                        </p>
                    </div>
                    
                    <div id={style.ScenePanelWidgets}>
                        <button onClick={showHelpPanel}>?</button>
                    </div>
                </div>
            <SubmitArea placeholder="What do you do?"/>

        </div>
    )

}