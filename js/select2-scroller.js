/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import pluginify from '@fxp/jquery-pluginify';
import BasePlugin from '@fxp/jquery-pluginify/js/plugin';
import FxpScroller from '@fxp/jquery-scroller';
import $ from "jquery";
import {onClose, onOpen} from "./utils/events";
import 'select2';

/**
 * Select2 Scroller class.
 */
export default class Select2Scroller extends BasePlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        this.scrollerOptions = $.extend(true, {}, FxpScroller.defaultOptions, options, {
            'contentSelector': '.select2-results__options'
        });
        this.$wrapper = null;

        this.$element.on('select2:open.fxp.select2scroller', null, this, onOpen);
        this.$element.on('select2:close.fxp.select2scroller', null, this, onClose);
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        this.$element.off('select2:open.fxp.select2scroller', onOpen);
        this.$element.off('select2:close.fxp.select2scroller', onClose);

        if (null !== this.$wrapper) {
            this.$wrapper.scroller('destroy');
        }

        super.destroy();
    }
}

/**
 * Defaults options.
 */
Select2Scroller.defaultOptions = {
    resultsWrapperClass: 'scroller-wrapper-select2-results'
};

pluginify('select2Scroller', 'fxp.select2scroller', Select2Scroller, true, '[data-select2-scroller="true"]');
