import React from 'react';
import { connect } from "react-redux";

import { updateWidgetName } from '../../state/actions/Actions'

import { DEFAULT_WIDGET_NAME, SCREENS } from '../../common/Constants'
import { MinimizeIcon, MaximizeIcon } from '../common/FontIcons'

const BaseWidget = WrappedComponent => {

    const widgetComp = (props) => {

        const { widgetName } = props

        if (!props.name) {
            props.updateWidgetName(DEFAULT_WIDGET_NAME)
        }

        function handleToggleClick() {
            if (props.name) {
                if (this.props.small) {
                    props.updateWidgetName(DEFAULT_WIDGET_NAME)
                }
                else {
                    props.updateWidgetName(this.props.name)
                }
            } else {
                this.props.history.push(SCREENS.DASHBOARD)
            }
        }

        function isInExpandedMode() {
            if (!props.name)
                return true
            return props.name === widgetName;
        }

        return (
            <div className={!props.name ? 'large-widget large-widget-container' :
                widgetName == props.name ? 'large-widget' : 'small-widget'}>
                <div>

                    {props.name ?
                        <div className="widget-toogle">
                            <div className={'toogle-icon ' +
                                (!props.name ? 'minimize' : widgetName == this.props.name ? 'minimize' : 'maximize')}
                            onClick={handleToggleClick}>

                                {widgetName == props.name ?
                                    <MinimizeIcon />
                                    :
                                    <MaximizeIcon />
                                }

                            </div>
                        </div>
                        : null}

                    <WrappedComponent {...props} isInExpandedMode={isInExpandedMode} />

                </div>
            </div>
        )
    }

    return widgetComp

};

const mapStateToProps = ({ widget }) => {
    return {
        widgetName: widget.widgetName
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateWidgetName: (s) => { dispatch(updateWidgetName(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseWidget);