export class Menu {

    public readonly children: Menu[] = [];
    /**
     * A special value understood by the UI, such as 'refresh'
     */
    public readonly actionId: string;
    public readonly directive: string;
    public readonly iconUrl: string;
    public readonly id: string;
    public readonly label: string;
    public readonly visible: boolean;
    /**
     * The menu is allowed (active) for these modes
     */
    public readonly modes: string[];
    public readonly type: string;

    public static findSubMenu(md: Menu, matcher: (menu: Menu) => boolean): Menu {
        if (matcher(md)) {
            return md;
        }
        if (md.children) {
            for (const child of md.children) {
                const result = Menu.findSubMenu(child, matcher);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    public findAtActionId(actionId: string): Menu {
        if (this.actionId === actionId) {
            return this;
        }
        let result = null;
        if (this.children) {
            this.children.some((md: Menu) => {
                result = md.findAtActionId(actionId);
                return result != null;
            });
        }
        return result;
    }

    public findContextMenu(): Menu {
        return Menu.findSubMenu(this, (md: Menu) => {
            return md.id === "CONTEXT_MENU";
        });
    }

    get isPresaveDirective(): boolean {
        return this.directive && this.directive === "PRESAVE";
    }

    get isRead(): boolean {
        return this.modes && this.modes.indexOf("R") > -1;
    }

    get isSeparator(): boolean {
        return this.type && this.type === "separator";
    }

    get isWrite(): boolean {
        return this.modes && this.modes.indexOf("W") > -1;
    }

}
