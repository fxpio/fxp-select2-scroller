/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Generate the list.
 *
 * @param {Number} pn  The page number
 * @param {Number} ps  The page size
 * @param {Number} max The max size of the list
 *
 * @returns {Array}
 */
function getItems(pn, ps, max) {
    var items = [],
        start = (pn - 1) * ps,
        end = Math.min(start + ps, max),
        i;

    for (i = start + 1; i <= end; i++) {
        items.push({
            id:   'item_' + i,
            text: 'Item ' + i
        });
    }

    return items;
}

var http = require('http'),
    url = require('url'),
    querystring = require('querystring'),
    server = http.createServer(function(req, res) {
        var page = url.parse(req.url).pathname,
            params = querystring.parse(url.parse(req.url).query),
            max = 70,
            pn = 'pn' in params ? parseInt(params['pn']) : 1,
            ps = 'ps' in params ? parseInt(params['ps']) : 10,
            s = 's' in params ? params.s : '',
            items = getItems(pn, ps, max);

        if (page !== '/ajax.json') {
            res.end();
            return;
        }

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });

        res.write(JSON.stringify({
            size: max,
            pageNumber: pn,
            pageSize: ps,
            items: items,
            search: s
        }));
        res.end();
    });

server.listen(9001);
