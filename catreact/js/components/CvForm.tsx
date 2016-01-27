/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react.d.ts"/>

import * as React from 'react'
import {CvState, CvProps, CvBaseMixin, CvDetails, CvList, CvMessage} from './catreat'
import {Try, ListContext, DetailsContext, FormContext, Log, NavRequest} from './catavolt'

export interface CvFormState extends CvState {
    formContext:FormContext;
}

export interface CvFormProps extends CvProps {
    onNavRequest?: (navRequestTry:Try<NavRequest>) => void;
}

/*
 ***************************************************
 * Render a FormContext
 ***************************************************
 */
export var CvForm = React.createClass<CvFormProps, CvFormState>({

    mixins: [CvBaseMixin],

    childContextTypes: {
        scopeObj: React.PropTypes.object
    },

    componentDidMount: function () {
        this.setState({formContext: this.context.scopeObj});
    },

    getChildContext: function () {
        return {scopeObj: this.state.formContext}
    },

    getInitialState: function () {
        return {formContext: null}
    },

    render: function () {

        const formContext = this.state.formContext;

        if (formContext) {
            if(React.Children.count(this.props.children) > 0) {
                return this.props.children
            } else {
                return <span>
                    {formContext.childrenContexts.map(context => {
                        Log.info('');
                        Log.info('Got a ' + context.constructor['name'] + ' for display');
                        Log.info('');
                        if (context instanceof ListContext) {
                            return <CvList paneRef={context.paneRef} key={context.paneRef}/>
                            } else if (context instanceof DetailsContext) {
                            return <CvDetails detailsContext={context} onNavRequest={this.props.onNavRequest}
                                              key={context.paneRef}/>
                            } else {
                            Log.info('');
                            Log.info('Not yet handling display for ' + context.constructor['name']);
                            Log.info('');
                            return <CvMessage message={"Not yet handling display for " + context.constructor['name']}
                                              key={context.paneRef}/>
                            }
                        })}
                    <div className="panel-footer"></div>
                </span>
            }
        } else {
            return null;
        }

    }

});
