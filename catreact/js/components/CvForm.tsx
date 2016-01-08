/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvFormState extends CvState {
}

interface CvFormProps extends CvProps{
    formContext:FormContext;
    onNavRequest: (navRequestTry:Try<NavRequest>) => void;
}

/*
 ***************************************************
 * Render a FormContext
 ***************************************************
 */
var CvForm = React.createClass<CvFormProps, CvFormState>({

    mixins: [CvBaseMixin],

    getInitialState: function(){
        return {statusMessage: ''};
    },

    render: function() {

        const formContext = this.props.formContext;

        return <span>
            {formContext.childrenContexts.map(context => {
                Log.info('');
                Log.info('Got a ' + context.constructor['name'] + ' for display');
                Log.info('');
                if (context instanceof ListContext) {
                    return <CvList listContext={context} onNavRequest={this.props.onNavRequest} key={context.paneRef}/>
                } else if (context instanceof DetailsContext) {
                    return <CvDetails detailsContext={context} onNavRequest={this.props.onNavRequest} key={context.paneRef}/>
                } else {
                    Log.info('');
                    Log.info('Not yet handling display for ' + context.constructor['name']);
                    Log.info('');
                    return <CvMessage message={"Not yet handling display for " + context.constructor['name']} key={context.paneRef}/>
                }
            })}
            <div className="panel-footer">{this.state.statusMessage}</div>
        </span>

        return <CvMessage message="Could not render any contexts!"/>
    }

});
