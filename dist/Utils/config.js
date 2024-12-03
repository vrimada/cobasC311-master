"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logLevel = exports.DBConfig = exports.idEfector = exports.analyzer = exports.numeroProtocolo = void 0;
exports.numeroProtocolo = 'numero'; // COMO MEJORA BUSCARLO EN LA BD
exports.analyzer = 'CobasC311';
exports.idEfector = 70;
exports.DBConfig = {
    server: "10.1.62.111",
    user: "testcobas",
    password: "t35tc0b45",
    database: "SilNeuquen"
};
exports.logLevel = 6;
/*
 * Logging levels in winston conform to the severity ordering specified by RFC5424:
severity of all levels is assumed to be numerically ascending from most important to least important.
   {
   emerg: 0,
   alert: 1,
   crit: 2,
   error: 3,
   warning: 4,
   notice: 5,
   info: 6,
   debug: 7
   }
*/ 
