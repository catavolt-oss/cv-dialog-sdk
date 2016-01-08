/**
 * Created by rburson on 12/23/15.
 */

///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../../typings/catavolt/catavolt_sdk.d.ts"/>
///<reference path="references.ts"/>

interface CvHeroHeaderState extends CvState {
}

interface CvHeroHeaderProps extends CvProps {
}

/*
 ***************************************************
 * When you need to look fancy
 ***************************************************
 */
var CvHeroHeader = React.createClass<CvHeroHeaderProps, CvHeroHeaderState>({

    mixins: [CvBaseMixin],

    render: function() {
        return (
            <div className="jumbotron logintron">
                <div className="container-fluid">
                    <div className="center-block">
                        <img className="img-responsive center-block" src="img/Catavolt-Logo-retina.png" style={{verticalAlign: 'middle'}}/>
                    </div>
                </div>
            </div>
        );
    }
});
