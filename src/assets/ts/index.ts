import {App} from './app'
import {JQueryEvents} from "./jquery-events";

import {initScrollbar} from "./smooth-scrollbar";

const app: App = new App();

const jQueryEvents: JQueryEvents = new JQueryEvents(app);
jQueryEvents.Bind();

initScrollbar();




