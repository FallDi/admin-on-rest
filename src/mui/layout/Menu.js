import React, { Component, PropTypes } from 'react';
import inflection from 'inflection';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import translate from '../../i18n/translate';

const styles = {
    open: {
        flex: '0 0 16em',
        order: -1,
        transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 0,
    },
    closed: {
        flex: '0 0 16em',
        order: -1,
        transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: '-16em',
    },
};

const translatedResourceName = (resource, translate) =>
    translate(`resources.${resource.name}.name`, {
        smart_count: 2,
        _: resource.options.label ?
            translate(resource.options.label, { smart_count: 2, _: resource.options.label }) :
            inflection.humanize(inflection.pluralize(resource.name)),
    });

class Menu extends Component {
    handleClose = () => {
        this.props.onRequestChange(false);
    }

    renderUndockedMenu() {
        const { resources, translate, logout, open, onRequestChange } = this.props;
        return (
            <Drawer docked={false} open={open} onRequestChange={onRequestChange}>
                {resources
                    .filter(r => r.list)
                    .map(resource =>
                        <MenuItem
                            key={resource.name}
                            containerElement={<Link to={`/${resource.name}`} />}
                            primaryText={translatedResourceName(resource, translate)}
                            leftIcon={<resource.icon />}
                            onTouchTap={this.handleClose}
                        />,
                    )
                }
                {logout}
            </Drawer>
        );
    }

    renderDockedMenu() {
        const { resources, translate, logout, open } = this.props;
        return (
            <Paper style={open ? styles.open : styles.closed}>
                <List>
                    {resources
                        .filter(r => r.list)
                        .map(resource =>
                            <ListItem
                                key={resource.name}
                                containerElement={<Link to={`/${resource.name}`} />}
                                primaryText={translatedResourceName(resource, translate)}
                                leftIcon={<resource.icon />}
                            />,
                        )
                    }
                </List>
                {logout}
            </Paper>
        );
    }

    render() {
        const { width } = this.props;
        return width === 1 ? this.renderUndockedMenu() : this.renderDockedMenu();
    }
}

Menu.propTypes = {
    resources: PropTypes.array.isRequired,
    translate: PropTypes.func.isRequired,
    logout: PropTypes.element,
    width: PropTypes.number,
};

const enhanced = compose(
    pure,
    translate,
);

export default enhanced(Menu);
