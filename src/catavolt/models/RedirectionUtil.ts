import { TypeNames } from './types';

export class RedirectionUtil {
    public static isRedirection(o: any): boolean {
        return [
            TypeNames.DialogRedirectionTypeName,
            TypeNames.NullRedirectionTypeName,
            TypeNames.WebRedirectionTypeName,
            TypeNames.WorkbenchRedirectionTypeName
        ].some(n => n === o.type);
    }

    public static isDialogRedirection(o: any): boolean {
        return o.type === TypeNames.DialogRedirectionTypeName;
    }

    public static isNullRedirection(o: any): boolean {
        return o.type === TypeNames.NullRedirectionTypeName;
    }

    public static isWebRedirection(o: any): boolean {
        return o.type === TypeNames.WebRedirectionTypeName;
    }

    public static isWorkbenchRedirection(o: any): boolean {
        return o.type === TypeNames.WorkbenchRedirectionTypeName;
    }
}
