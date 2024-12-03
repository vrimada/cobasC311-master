"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processResultRecords = processResultRecords;
exports.composeOrderMessages = composeOrderMessages;
const db_1 = require("./db");
const Records_1 = require("./Records/Records");
/**  prepara los resultados de COBAS y los graba en SIL */
function processResultRecords(records) {
    let resultados = records.getResultados();
    resultados.forEach(element => {
        (0, db_1.guardarResultados)(element, records.getOrden());
    });
}
/** Protocol son los datos que trae del SIL por Consulta SQL para enviar a COBAS
 * Return devuelve el string del Header, del Paciente, de la Orden, del comentario, y de la Finalizacion
*/
function composeOrderMessages(protocol) {
    let record = new Records_1.Records();
    let patient = record.getPaciente(); // Informacion del paciente
    let order = record.getOrden(); // Informacion de la Orden
    patient.cargarPatientRecord(protocol);
    order.cargarOrderRecordParaCobas(protocol);
    record.setPaciente(patient);
    record.setOrden(order);
    return record;
}
