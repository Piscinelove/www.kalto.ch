var googleString;
var stringArray = [];
var queryObject = generateQueryObject();
var EQ = '=';
var AMP = '&';

for (var v in queryObject) {
    var str = v + EQ + queryObject[v];

    stringArray.push(str);
    googleString = stringArray.join(AMP);
}

function generateQueryObject() {
    var obj = [];
    var pageURL = window.location.href;
    var URLArray = pageURL.split('?');

    if (URLArray[1]) {
        var argsArray = URLArray[1].split('&');
        var l = argsArray.length;

        for(i = 0; i < l; i++) {
            var individualArg = argsArray[i].split('=');

            if(individualArg[1] && individualArg[1].indexOf('#') > -1) {
                var dropHashArray = individualArg[1].split('#');

                individualArg[1] = dropHashArray[0];
            }

            obj[individualArg[0]] = individualArg[1];
        }
    }
    return obj;
}

var now = new Date();
var time = now.getTime();
var expireTime = time + 75000 * 36000;
now.setTime(expireTime);

if (googleString) {
    document.cookie = 'utm_cookie=' + googleString + ';expires=' + now.toGMTString() + ';path=/';
}
