import { SubmitArea } from "../common/SubmitArea";
import style from "@/app/styles/HelpPanel.module.css";
import { hideHelpPanel } from "../page";

export function HelpPanel() {
    return (
        <>
            <div id={style.HelpPanel}>
                
                <div id={style.HelpResponseDiv}>
                    <div id={style.HelpPanelBar}>
                        <button onClick={() => {
                            hideHelpPanel();
                        }}>x</button>
                    </div>
                    <div id={style.HelpResponseText}>
                        <p>

                        </p>
                    </div>
                </div>
                <SubmitArea />
            </div>
        </>
    )
}