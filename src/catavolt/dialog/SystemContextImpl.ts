/**
 * Created by rburson on 3/9/15.
 */

///<reference path="../ws/references.ts"/>

module catavolt.dialog {

    export class SystemContextImpl implements  SystemContext{

        constructor(private _scheme: string,
                    private _host: string,
                    private _port: number,
                    private _path: string){}

        get scheme():string {
           return this._scheme;
        }

        get host(): string {
            return this._host;
        }

        get port(): number {
            return this._port;
        }

        get path(): string {
            return this._path;
        }

        toURLString():string {

            var urlString = "";
            if(this._host) {
                if(this._scheme) {
                    urlString += this._scheme + "://";
                }
                urlString += this._host;
                if(this.port) {
                    urlString += ":" + this._port;
                }
                urlString += "/";
            }
            if(this._path) {
                urlString += this._path + "/";
            }

            return urlString;
        }
    }
}