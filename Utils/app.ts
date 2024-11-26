import { saveResult } from './db'
import { OrderRecord } from './Records/OrderRecord';
import { HeaderRecord } from './Records/HeaderRecord';
import { PatientRecord } from './Records/PatientRecord';
import { CommentRecord } from './Records/CommentRecord';
import { TerminationRecord } from './Records/TerminationRecord';
import { Records } from './Records/Records';

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
export function composeOrderMessages(protocol : object) : Records{
    
    let patient : PatientRecord = new PatientRecord();// Informacion del paciente
    patient.cargarPatientRecord(protocol);
    
    let order : OrderRecord = new OrderRecord();// Informacion de la Orden
    order.cargarOrderRecordParaCobas(protocol);

    let record = new Records();
    record.setPaciente(patient);
    record.setOrden(order);
    return record;
}
