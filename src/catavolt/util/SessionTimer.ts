/**
 * Simple timer that checks the remaining session time (from the given function) every checkIntervalMillis
 * and fires the onSessionExpired callback if the time is about to expire
 */
import {Log} from "./Log";

export class SessionTimer {

    private sessionInterval:any;

    public constructor(private remainingSessionTimeFn:()=>number,
                       private checkIntervalMillis:number,
                       private onSessionExpired:()=>void) {

    };

    public resetSessionTimer():void {
        this.stopSessionTimer();
        this.sessionInterval = setInterval(()=>{
            // Log.debug(`SessionTimer: ${this.remainingSessionTimeFn()} < ${this.checkIntervalMillis}`);
            if(this.remainingSessionTimeFn() < this.checkIntervalMillis) {
                clearInterval(this.sessionInterval);
                this.onSessionExpired();
            }
        }, this.checkIntervalMillis);
    };

    public stopSessionTimer():void {
        if(this.sessionInterval) {
            clearInterval(this.sessionInterval);
        }
    };
}
