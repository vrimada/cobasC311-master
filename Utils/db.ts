let { logger } = require('winston');
let { sql } = require("seriate");

import { ResultRecord }  from './Records/ResultRecord';
import { OrderRecord } from './Records/OrderRecord';
import { DBConfig, analyzer, idEfector } from './config';

// SQL Server config settings
sql.setDefaultConfig(DBConfig);


//Guarda los resultados un item del Cobas al SIL
export function saveResult(result : ResultRecord, order : OrderRecord) : void {
    let tipoMuestra : string = "Suero/Plasma";

    switch (order.getBiomaterial()) {
        case 1: tipoMuestra = "Suero/Plasma"; break; // TODO Colocar los Prefijos del tipo de muestra correctos
        case 2: tipoMuestra = "Orina"; break;
        case 3: tipoMuestra = "CSF"; break;
        case 4: tipoMuestra = "Suprnt"; break;
        case 5: tipoMuestra = "Otros"; break;
    }

    let sampleId : string = String(order.getSampleId()).trim();  
    let sampleProtocolo : string = '';
    let sampleSector : string = '';
    let elem : string = "";
    let i : number;

    for (i = 0; i < sampleId.length; i++) {
        elem  = sampleId.charAt(i);
        switch (elem) {
            case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
                sampleProtocolo = sampleProtocolo + elem;
                break;

            default:
                sampleSector = sampleSector + elem;
            break;
        }
    }

    let queryModificada : string;
    let errMessage : string;
    //Fix para cuando tienen los protocolos divididos por sectores
    
    if (!isNaN(parseInt(sampleSector))) {
        queryModificada = "SELECT TOP 1 idProtocolo FROM LAB_Protocolo WHERE numero = @_sampleId AND baja=0 AND estado<2";
    } else {
        sampleId = sampleProtocolo;
        queryModificada = "SELECT TOP 1 idProtocolo FROM LAB_Protocolo WHERE numeroSector = @_sampleId AND prefijoSector = @_sampleSector AND baja=0 AND estado<2";
    }

 

    //console.log('Esta es la query:', queryModificada);

    /*
    getPlainContext( [connection] )
        This method returns a SqlContext instance, and allows you to add 1 or more steps to the context, 
        with each step representing a query/command that should be executed in the database. 
        Steps are given an alias (which is used to identify the result set returned), 
        and the query details can be provided as an object (which we"ll see below), 
        or a callback that takes an execute continuation (which is used to process your query options argument). 
     */

    sql.getPlainContext()
        .step("queryProtocoloById", {
            query: queryModificada,
            params: {
                _sampleId: { type: sql.INT, val: parseInt(sampleId)},
                _sampleSector: { type: sql.NVARCHAR, val: sampleSector }
            }
        })
        .step("queryCobasC311WithBiomaterial", function (execute:any, data:any) {
            execute({
                query: "SELECT TOP 1 * FROM LAB_CobasC311 WHERE idItemCobas = @_idItemCobas AND tipoMuestra = @_tipoMuestra",
                params: {
                    _idItemCobas: { type: sql.INT, val: result.getIdItemCobas() },
                    _tipoMuestra: { type: sql.NVARCHAR, val: tipoMuestra }
                }
            });

        })
        .step("queryCobasC311WithPrefijoTipoMuestra", function (execute:any, data:any) {
            execute({
                query: "SELECT TOP 1 * FROM LAB_CobasC311 WHERE idItemCobas = @_idItemCobas AND prefijo = @_prefijo AND tipoMuestra = @_tipoMuestra",
                params: {
                    _idItemCobas: { type: sql.INT, val: result.getIdItemCobas() },
                    _prefijo: { type: sql.NVARCHAR, val: order.getPrefijoTipoMuestra() },
                    _tipoMuestra: { type: sql.NVARCHAR, val: tipoMuestra }
                }
            });
        })
        .end(function (sets:any) {
            /*
                The end method of a SqlContext instance takes a callback which receives a sets argument. 
                The sets argument contains the dataset(s) from each step (using the step alias as the property name). 
                The error method allows you to pass a callback that will receive an error notfication if anything fails.
                Note that calling end or error is what starts the unit of work handled by the context.  
            */
            if (!sets.queryProtocoloById[0]) {
                errMessage = 'No se encontro el protocolo especificado con id:' + order.getSampleId();
                logger.error(errMessage);
                logMessages(errMessage);
                throw new Error(errMessage);
            }

            let idProtocolo : number = sets.queryProtocoloById[0].idProtocolo;
            let idItem : string = "";

            if (sets.queryCobasC311WithPrefijoTipoMuestra[0]) {
                idItem = sets.queryCobasC311WithPrefijoTipoMuestra[0].idItemSil;

            }
            else {
                if (sets.queryCobasC311WithBiomaterial[0]) {
                    idItem = sets.queryCobasC311WithBiomaterial[0].idItemSil;
                }
                else {
                    errMessage = 'No se encontro el subItem especificado con idItemCobas:' + result.getIdItemCobas() + ' y tipoMuestra:' + tipoMuestra;
                    logger.error(errMessage);
                    logMessages(errMessage);
                }
            }

            if (idItem !== "") {
                sql.execute({
                    query: "UPDATE LAB_DetalleProtocolo set resultadoNum = @_resultadoNum, unidadMedida = @_unidadMedida, conResultado=1, enviado=2, fechaResultado= @_fechaResultado" +
                    " WHERE idProtocolo= @_idProtocolo AND idSubItem= @_idSubItem AND idUsuarioValida=0",
                    params: {
                        _resultadoNum: { type: sql.REAL, val: result.getValue() },
                        _fechaResultado: { type: sql.DATETIME, val: order.getDateTimeReported() },
                        _unidadMedida: { type: sql.NVARCHAR, val: result.getUnits() },
                        _idProtocolo: { type: sql.INT, val: idProtocolo },
                        _idSubItem: { type: sql.INT, val: idItem }
                    }
                });
                logger.info(result.getValue() )
                logger.info('LAB_DetalleProtocolo actualizado para subItem:', idItem);
            }

        })
        .error(function (err : string) {
            logger.error(err);
            logMessages(errMessage);
        }
    );
}

export function hasProtocolsToSend() {
    return sql.execute({
        query: "SELECT count(*) as total FROM LAB_TempProtocoloEnvio WHERE equipo = @equipo AND idEfector = @idEfector",
        params: {
            equipo: { type: sql.NVARCHAR, val: analyzer },
            idEfector: { type : sql.INT, val: idEfector }
        }
    })

}

export function getNextProtocolToSend()   {
    return sql.execute({
        query: "SELECT TOP 1 * FROM LAB_TempProtocoloEnvio WHERE equipo = @equipo  AND idEfector = @idEfector",
        params: {
            equipo: { type: sql.NVARCHAR, val: analyzer },
            idEfector: { type : sql.INT, val: idEfector }
        }
    })
}

export function removeLastProtocolSent() : void {
    getNextProtocolToSend().then(function (results : any) {
        for (var i = 0; i < results.length; i++) { // Always only 1 iteration
            var protocol = results[i];
            removeProtocol(protocol.idTempProtocoloEnvio);
        }
    }, function (err : String) {
        logger.error("Something bad happened:", err);
    });
}

export function removeProtocol(idTempProtocolo : number) {
    return sql.execute({
        query: "DELETE FROM LAB_TempProtocoloEnvio WHERE idTempProtocoloEnvio = @_id",
        params: {
            _id: {
                type: sql.INT,
                val: idTempProtocolo,
            }
        }
    })
}

export function logMessages(logMessage : string) : void{
    var logTime = new Date();
    sql.execute({
        query: "INSERT INTO Temp_Mensaje(mensaje,fechaRegistro, idEfector) VALUES (@_mensaje,@_fechaRegistro, @idEfector)",
        params: {
            _mensaje: { type: sql.NVARCHAR, val: logMessage },
            _fechaRegistro : {type : sql.DATETIME, val : logTime },
            idEfector: { type : sql.INT , val: idEfector }
        }
    }).then(function (results) {
        logger.info(results);
    }, function (err) {
        logger.error("Something bad happened:", err);
    });
   
}