/**
 * Created by rburson on 3/27/15.
 */

export interface ActionSource {
    fromActionSource:ActionSource;
    virtualPathSuffix:Array<string>;
}
