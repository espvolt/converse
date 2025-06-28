export async function post2json(url: string, body_: any) {
    var resp = await fetch(url, {
        body: JSON.stringify(body_),
        method: "post"
    });

    if (resp.status != 200) {
        return null;
    }

    return await resp.json();
}

export class TextIntervaledConfig {
    defaultPause: number = 50;
    periodPause: number = 150;

    newTextCallback: Function | null = null;
    finishedCallback: Function | null = null;
}

export function makeTextIntervaled(text: string, config: TextIntervaledConfig) {
    var index: number = 0;
    var intervalID: NodeJS.Timeout | null = null;
    
    function createDefaultInterval() {
        intervalID = setInterval(() => {
            config.newTextCallback!(text.substring(0, index))
            
            if (index >= text.length) {
                if (config.finishedCallback != null) {
                    config.finishedCallback();
                }

                clearInterval(intervalID!);
                return;
            }

            if (text.charAt(index) == "." || text.charAt(index) == ",") {
                index++;
                config.newTextCallback!(text.substring(0, index));
                clearInterval(intervalID!);
                createPeriodInterval();
                return;
            }


            index++;
        }, config.defaultPause);
    }

    function createPeriodInterval() {
        var initial = false

        intervalID = setInterval(() => {
            if (initial) {
                clearInterval(intervalID!);
                index++;
                createDefaultInterval();
            }

            initial = true;
        }, config.periodPause);
    }

    createDefaultInterval();

    return () => {
        if (intervalID != null) {
            clearInterval(intervalID);
        }
    }
    
}