"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateIdForRecord;
function generateIdForRecord() {
  return Math.random().toString(32).slice(2).substr(0, 5);
}