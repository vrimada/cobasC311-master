import { guardarResultados } from './db'
import { OrderRecord } from './Records/OrderRecord';
import { PatientRecord } from './Records/PatientRecord';
import { Records } from './Records/Records';
import { TempProtocoloEnvio } from './TempProtocoloEnvio';

/**  prepara los resultados de COBAS y los graba en SIL */
export function processResultRecords(records : Records) : void{
    let resultados = records.getResultados();
    resultados.forEach(element => {
        guardarResultados(element,records.getOrden());
    });
}

/** Protocol son los datos que trae del SIL por Consulta SQL para enviar a COBAS
 * Return devuelve el string del Header, del Paciente, de la Orden, del comentario, y de la Finalizacion
*/
export function composeOrderMessages(protocol : TempProtocoloEnvio) : Records{
    let record : Records = new Records();
    let patient : PatientRecord = record.getPaciente();// Informacion del paciente
    let order : OrderRecord = record.getOrden();// Informacion de la Orden

    patient.cargarPatientRecord(protocol);
    order.cargarOrderRecordParaCobas(protocol);
    
    record.setPaciente(patient);
    record.setOrden(order);
    return record;
}
