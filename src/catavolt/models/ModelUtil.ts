import {StringDictionary} from "../util";

export interface ModelUtil {

    jsonToModel<A>(obj, n?): Promise<A>;
    modelToJson(obj, filterFn?: (prop) => boolean): StringDictionary;
}
