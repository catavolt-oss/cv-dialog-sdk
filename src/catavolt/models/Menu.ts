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
            return md.id === 'CONTEXT_MENU';
        });
    }

    public findActionBarMenu(): Menu {
        return Menu.findSubMenu(this, (md: Menu) => {
            return md.id === 'ACTION_BAR';
        });
    }

    get isPresaveDirective(): boolean {
        return this.directive && this.directive === 'PRESAVE';
    }

    get isRead(): boolean {
        return Menu.isRead(this);
    }

    get isSeparator(): boolean {
        return Menu.isSeparator(this);
    }

    get isWrite(): boolean {
        return Menu.isWrite(this);
    }

    public static isRead(menu:Menu):boolean {
       return menu.modes && menu.modes.indexOf('READ') > -1;
    }

    public static isSeparator(menu:Menu): boolean {
        return menu.type && menu.type === 'separator';
    }

    public static isWrite(menu:Menu): boolean {
        return menu.modes && menu.modes.indexOf('WRITE') > -1;
    }
}
