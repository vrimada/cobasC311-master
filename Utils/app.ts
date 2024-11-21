import { saveResult } from './db.js'
import { OrderRecord } from './Records/OrderRecord.js';
import { HeaderRecord } from './Records/HeaderRecord.js';
import { PatientRecord } from './Records/PatientRecord.js';
import { CommentRecord } from './Records/CommentRecord.js';
import { TerminationRecord } from './Records/TerminationRecord.js';
import { Records } from './Records/Records.js';

/**  prepara los resultados de COBAS y los graba en SIL */
export function processResultRecords(records : Records) : void{
    let resultados = records.getResultados();
    resultados.forEach(element => {
        saveResult(element,records.getOrden());
    });
}

/** Protocol son los datos que trae del SIL por Consulta SQL para enviar a COBAS
 * Return devuelve el string del Header, del Paciente, de la Orden, del comentario, y de la Finalizacion
*/
export function composeOrderMessages(protocol : object) {
    let header = new HeaderRecord();
    let coment = new CommentRecord();
    let termination = new TerminationRecord();

    let patient : PatientRecord = new PatientRecord();// Informacion del paciente
    patient.cargarPatientRecord(protocol);
    
    let order : OrderRecord = new OrderRecord();// Informacion de la Orden
    order.cargarOrderRecordParaCobas(protocol);


    return [[header.toASTM(),patient.toASTM(),order.toASTM(),coment.toASTM(),termination.toASTM()]];
}
