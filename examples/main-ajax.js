/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'select2/dist/css/select2.css';
import '@fxp/jquery-scroller/less/scroller.less';
import '../js/select2-scroller';

let config = {
    ajax: {
        url: "/ajax.json",
        dataType: 'json',
        delay: 250,
        cache: false,
        data: function (params) {
            return {
                s: params.term,
                pn: params.page,
                ps: 10
            };
        },
        processResults: function (data, params) {
            params.page = params.page || 1;

            return {
                results: data.items,
                pagination: {
                    more: (params.page * data.pageSize) < data.size
                }
            };
        }
    }
};

$('#form-select').select2(config);
$('#form-select-multi').select2($.extend(config, {
    multiple: true
}));
$(window).trigger('load');
