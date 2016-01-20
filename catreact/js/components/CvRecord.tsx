/**
 * Created by rburson on 1/14/16.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvRecordState extends CvState {
}

interface CvRecordProps extends CvProps {
    navTarget?:string;
    entityRec?:EntityRec;
}

/*
 ***************************************************
 * Render an EntityRec
 ***************************************************
 */
var CvRecord = React.createClass<CvRecordProps, CvRecordState>({

    mixins: [CvBaseMixin],

    childContextTypes: {
        scopeObj: React.PropTypes.object
    },

    componentDidMount: function () {
    },

    getChildContext: function () {
        return {scopeObj: this.props.entityRec}
    },

    getInitialState: function () {
        return {}
    },

    render: function () {

        const entityRec = this.props.entityRec;

        if (entityRec) {
            if (React.Children.count(this.props.children) > 0) {
                return this.props.clickAction ? <span onClick={this.itemClicked.bind(this, entityRec.objectId)}>{this.props.children}</span> : this.props.children;
            } else {
                return <span>{'Default row goes here'}</span>
            }
        } else {
            return null;
        }

    },

    itemClicked: function (objectId:string, actionId:string) {
        //@TODO - currently this is only the default action
        const paneContext:PaneContext = this.context.scopeObj;
        if (paneContext instanceof ListContext) {
            const listContext:ListContext = paneContext;
            if (listContext.listDef.defaultActionId) {
                var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW',
                    listContext.listDef.defaultActionId, null, null, []);
                listContext.performMenuAction(defaultActionMenuDef, [objectId]).onComplete(navRequestTry=> {
                    (this.context.eventRegistry as CvEventRegistry)
                        .publish<CvNavigationResult>({
                            type: CvEventType.NAVIGATION, eventObj: {
                                navRequestTry: navRequestTry,
                                actionId: listContext.listDef.defaultActionId,
                                navTarget: this.props.navTarget
                            }
                        });
                });
            }
        }
    }

});