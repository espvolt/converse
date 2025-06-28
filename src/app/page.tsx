"use client"

import AppBody from "./common/AppBody"
import mainPageStyle from "@/app/styles/MainAppBody.module.css"
import TextingPanel from "./panels/TextingPanel"
import { ScenePanel } from "./panels/ScenePanel"
import { HelpPanel } from "./panels/HelpPanel"
import { useState } from "react"


export default function App() {
  return (
    <AppBody child={ MainPage() }  />
  )
}


var helpPanelSetter: Function | null = null;
var backgroundImageSetter: Function | null = null;

export function showHelpPanel() {
  if (helpPanelSetter == null) { return; }

  helpPanelSetter(true);
}

export function hideHelpPanel() {
  if (helpPanelSetter == null) { return; }
  helpPanelSetter(false);
}


export function setBackgroundImage(val: string) {
  if (backgroundImageSetter == null) { return; }
  backgroundImageSetter(val);
}
function MainPage() {
  const [helpPanelShown, setHelpPanelShown] = useState(false);
  const [currentBackgroundImage, setBackgroundImage_] = useState("");
  
  helpPanelSetter = (val: boolean) => {
    setHelpPanelShown(val);
  }

  backgroundImageSetter = (val: string) => {
    setBackgroundImage_(val);
    console.log(val);
  }
  
  
  const currentStyle = {
    opacity: currentBackgroundImage.length > 0 ? .3 : 1.0
  }
  return (
    <div id={mainPageStyle.MainAppBody}>
      <div id={mainPageStyle.BackgroundImage}>
        
        <img src={currentBackgroundImage.length == 0 ? undefined : "data:image/jpeg;base64," + currentBackgroundImage}></img>
      </div>
      <div id={mainPageStyle.TextingPanelDiv} style={currentStyle}>
        <TextingPanel />
      </div>
      <div id={mainPageStyle.ScenePanelDiv} style={currentStyle}>
        <ScenePanel initialText="This is a test!"/>
      </div>
      <div id={mainPageStyle.HelpPanelDiv} style={{display: helpPanelShown ? "block" : "none"}}>
        <HelpPanel />
      </div>

    </div>
  )
}