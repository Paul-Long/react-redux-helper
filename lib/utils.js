'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isArray = exports.isString = exports.isFunction = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.isHTMLElement = isHTMLElement;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isFunction = exports.isFunction = function isFunction(o) {
  return typeof o === 'function';
};
var isString = exports.isString = function isString(o) {
  return typeof o === 'string';
};
var isArray = exports.isArray = Array.isArray.bind(Array);
function isHTMLElement(node) {
  return (typeof node === 'undefined' ? 'undefined' : (0, _typeof3.default)(node)) === 'object' && node !== null && node.nodeType && node.nodeName;
}