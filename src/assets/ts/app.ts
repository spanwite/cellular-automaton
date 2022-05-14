import Game from './components/core/game';
import JQueryEvents from './components/jquery-events';

import initScrollbar from './components/smooth-scrollbar';

const game = new Game();

const jQueryEvents = new JQueryEvents(game);
jQueryEvents.Bind();

initScrollbar();