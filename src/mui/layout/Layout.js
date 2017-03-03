import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoprefixer from 'material-ui/utils/autoprefixer';
import withWidth from 'material-ui/utils/withWidth';
import CircularProgress from 'material-ui/CircularProgress';
import compose from 'recompose/compose';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from './AppBar';
import Notification from './Notification';
import Menu from './Menu';
import defaultTheme from '../defaultTheme';

injectTapEventPlugin();

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    body: {
        backgroundColor: '#edecec',
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
    },
    bodySmall: {
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: '2em',
    },
    contentSmall: {
        flex: 1,
    },
    loader: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 16,
        zIndex: 1200,
    },
};

const prefixedStyles = {};

class Layout extends Component {
    state = {
        sidebarOpen: true,
    };

    componentWillMount() {
        this.setState({ sidebarOpen: this.props.width !== 1 });
    }

    setSidebarVisibility = (open) => {
        this.setState({ sidebarOpen: open });
    }

    toggleSidebar = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }

    render() {
        const { isLoading, children, route, title, theme, logout, width } = this.props;
        const { sidebarOpen } = this.state;
        const muiTheme = getMuiTheme(theme);
        if (!prefixedStyles.main) {
            // do this once because user agent never changes
            const prefix = autoprefixer(muiTheme);
            prefixedStyles.main = prefix(styles.main);
            prefixedStyles.body = prefix(styles.body);
            prefixedStyles.content = prefix(styles.content);
        }
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={prefixedStyles.main}>
                    { width !== 1 && <AppBar title={title} onLeftIconButtonTouchTap={this.toggleSidebar} />}
                    <div className="body" style={width === 1 ? prefixedStyles.bodySmall : prefixedStyles.body}>
                        <div style={width === 1 ? prefixedStyles.contentSmall : prefixedStyles.content}>{children}</div>
                        <Menu resources={route.resources} logout={logout} open={sidebarOpen} width={width} onRequestChange={this.setSidebarVisibility} />
                    </div>
                    <Notification />
                    {isLoading && <CircularProgress
                        color="#fff"
                        size={30}
                        thickness={2}
                        style={styles.loader}
                    />}
                </div>
            </MuiThemeProvider>
        );
    }
}

Layout.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    children: PropTypes.node,
    logout: PropTypes.element,
    route: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    width: PropTypes.number,
};

Layout.defaultProps = {
    theme: defaultTheme,
};

function mapStateToProps(state) {
    return { isLoading: state.admin.loading > 0 };
}

const enhance = compose(
    withWidth(),
    connect(mapStateToProps),
);

export default enhance(Layout);
