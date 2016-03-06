// see https://regex.wtf/url-matching-regex-javascript/
var URLHelper = {};
module.exports = URLHelper;

URLHelper.validate=function (str) {
    var patterns = {
        protocol: '^(http(s)?(:\/\/))?(www\.)?',
        domain: '[a-zA-Z0-9-_\.]+',
        tld: '(\.[a-zA-Z0-9]{2,})',
        params: '([-a-zA-Z0-9:%_\+.~#?&//=]*)'
    }; // /([www])?\.?((\w+)\.+)([a-zA-Z]{2,})/gi
    var pattern = new RegExp(patterns.protocol + patterns.domain + patterns.tld + patterns.params, 'gi');
    if(!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}
