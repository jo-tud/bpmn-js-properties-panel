// see https://regex.wtf/url-matching-regex-javascript/
var URLHelper = {};
module.exports = URLHelper;

URLHelper.validate=function (str) {
    var patterns = {
        protocol: '^(http(s)?:\/\/)?(www\.|(?!www))[a-z\d]',
        domain: '[a-z0-9-_\.]+',
        tld: '(\.[a-z]{2,4})(\:[0-9]+)?',
        params: '(\/[-a-z0-9:%_\+.~#?&//=]*)?$'
    }; // /([www])?\.?((\w+)\.+)([a-zA-Z]{2,})/gi
    var pattern = new RegExp(patterns.protocol + patterns.domain + patterns.tld + patterns.params, 'gi');
    return pattern.test(str)
}
