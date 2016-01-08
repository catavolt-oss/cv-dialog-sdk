/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvMenuState extends CvState {
}

interface CvMenuProps extends CvProps {
    menuDef:MenuDef;
}

/*
 ***************************************************
 * Render a 'context menu' for a MenuDef
 ***************************************************
 */

var CvMenu = React.createClass<CvMenuProps, CvMenuState>({

    mixins: [CvBaseMixin],

    render: function() {

        const menuDef = this.props.menuDef;

        var findContextMenuDef = md => {
            if(md.name === 'CONTEXT_MENU') return md;
            if(md.menuDefs) {
                for (let i = 0; i < md.menuDefs.length; i++) {
                    let result = findContextMenuDef(md.menuDefs[i]);
                    if (result) return result;
                }
            }
            return null;
        }

        const ctxMenuDef = findContextMenuDef(menuDef);

        return (
            <div className="btn-group">
                <button type="button" className="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown">
                    <span className="caret"> </span>
                </button>
                <ul className="dropdown-menu" role="menu">
                    {ctxMenuDef.menuDefs.map((md, index)=>{
                        return <li key={index}><a onClick={this.performMenuAction(md.actionId)}>{md.label}</a></li>
                    })}
                    <li className="divider" key="divider"> </li>
                    <li key="select_all"><a onClick={this.selectAll()}>Select All</a></li>
                    <li key="deselect_all"><a onClick={this.deselectAll()}>Deselect All</a></li>
                </ul>
            </div>
        );
    },

    performMenuAction() {
    },

    selectAll: function() {
    },

    deselectAll: function() {
    },

});
