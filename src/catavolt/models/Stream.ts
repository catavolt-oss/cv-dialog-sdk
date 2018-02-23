import {View} from "./View";

export class Stream extends View {

    public readonly topic: string;
    public readonly bufferSize: number;
    public readonly view: View;

}
