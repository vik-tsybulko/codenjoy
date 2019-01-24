// vendor
import React, { Component } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import ReactGA from 'react-ga';
import ReactPixel from 'react-facebook-pixel';
import 'reset-css';
import { PersistGate } from 'redux-persist/integration/react';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faTimesCircle,
    faCheckCircle,
    faStar,
    faArrowUp,
    faArrowRight,
    faShareAlt,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
    faSquare as farSquare,
    faCheckSquare as farCheckSquare,
    faEnvelope as farEnvelope,
    faComments as farComments,
    faUserCircle as farUserCircle,
} from '@fortawesome/free-regular-svg-icons';

// proj
import store, { history, persistor } from './store';
import Routes from './routes/Routes';
import CustomScrollbars from './CustomScrollbars';

library.add(
    faTimesCircle,
    faCheckCircle,
    farCheckSquare,
    farSquare,
    faStar,
    faArrowUp,
    faArrowRight,
    farEnvelope,
    faShareAlt,
    farComments,
    faUser,
    farUserCircle,
);

const reactPixelOptions = { autoConfig: false };
const reactGAOptions =
    process.env.NODE_ENV === 'development' ? { testMode: true } : {};
ReactGA.initialize(process.env.REACT_APP_GA_ID, reactGAOptions);
ReactPixel.init(process.env.REACT_APP_FB_PIXEL_ID, void 0, reactPixelOptions);

class App extends Component {
    render() {
        return (
            <Provider store={ store }>
                <PersistGate loading={ null } persistor={ persistor }>
                    <ConnectedRouter history={ history }>
                        <CustomScrollbars>
                            <Routes />
                        </CustomScrollbars>
                    </ConnectedRouter>
                </PersistGate>
            </Provider>
        );
    }
}

export default App;
