"use client"
import style from "@/app/styles/SubmitArea.module.css"
import { useState } from "react";

export class SubmitAreaOptions {
    onSubmitCallback?: Function = (text: string) => {};
    placeholder?: string = "";
}



export function SubmitArea({onSubmitCallback, placeholder}: SubmitAreaOptions) {
    const [currentText, setCurrentText] = useState("");
    return (
        <div className={style.submitArea}>
            <div className={style.submitAreaDiv}>
                <textarea 
                    value={currentText}
                    placeholder={placeholder}
                    onSubmit={() => {
                        if (onSubmitCallback == null) { return; }
                        onSubmitCallback(currentText);
                    }}
                    onChange={(event) => {
                        setCurrentText(event.target.value);
                    }}/>
            </div>
            <button 
                onClick={() => {
                    if (onSubmitCallback == null) { return; }
                    onSubmitCallback(currentText);
                }}>S</button>
        </div>
    )
}