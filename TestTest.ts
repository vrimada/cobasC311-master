import { decodeMessage } from "./Utils/codec.js";
import { OrderRecord } from "./Utils/Records/OrderRecord.js";
import { PatientRecord } from "./Utils/Records/PatientRecord.js";
import { Records } from "./Utils/Records/Records.js";

import sql  from 'mssql';
const sql = require('mssql');

var config = {
    user: 'vrimada',
    password: '9zhUcY8G',
    server: '10.1.62.111',  //You can use 'localhost\\instance' to connect to named instance
    database: 'SilNeuquen'
}

// EJEMPLO COBAS A SIL


let message4 = "\x021H|\^&|||H7600^1|||||host|RSUPL^REAL|P|1\x0DP|1|||||||U||||||^\x0DO|1|                123456|0^50005^005^^S1^SC|^^^717^\^^^418^\^^^798^\^^^570^\^^^435^\^^^690^\^^^781^|R||20190111102416||||N||||1|||||||20190111102948|||F\x0DC|1|I|                    \x17F3\x0D\x0A\x022          ^^^^|G\x0DR|1|^^^717/|298|mg/dl||N||F||      |||P1\x0DC|1|I|0|I\x0DR|2|^^^418/|29|mg/dl||N||F||      |||P1\x0DC|1|I|0|I\x0DR|3|^^^798/|344|mg/dl||N||F||      |||P1\x0DC|1|I|0|I\x0DR|4|^^^570/|78|U/l||N||F||      |||P1\x0DC|1|I|0|I\x0DR|5|^^^435/|29|mg/dl||N\x176C\x0D\x0A\x023||F||      |||P1\x0DC|1|I|0|I\x0DR|6|^^^690/|0.85|mg/dl||N||F||      |||P1\x0DC|1|I|0|I\x0DR|7|^^^781/|1078|mg/dl||HH||F||      |||P1\x0DC|1|I|26|I\x0DL|1|N\x0D\x0390\x0D\x0A";
//console.log("Ejemplo (1) de String en formato ASTM");
console.dir(message4);

let dec : Records = decodeMessage(message4);
console.log("Codificado (1) a Record y luego en formato ASTM ");
let st = dec.toASTM();
//console.log(JSON.stringify(st));
console.dir(st);

//EJEMPLO SIL A COBAS
/*
sql.connect(config).then(function() {
	new sql.Request()
    .input('idEfector', sql.Int, 70)
    .input('equipo',sql.NVARCHAR,'CobasC311' )
	.query("SELECT TOP 1 * FROM LAB_TempProtocoloEnvio WHERE equipo = @equipo  AND idEfector = @idEfector")
    .then(function(recordset) {
        console.log("Ejemplo (2) de Protocolo tomado de SIL DEMO");
		console.dir(recordset);

        let o = new Records();
        let patient : PatientRecord = o.getPaciente(); //Informacion del paciente
        patient.cargarPatientRecord(recordset);
        o.setPaciente(patient);
        let order : OrderRecord = o.getOrden(); //Informacion de la Orden
        order.cargarOrderRecordParaCobas(recordset);
        o.setOrden(order);

       let outputChunks = encode(o);

       console.log("ENCODE DATOS en array");
       console.dir( outputChunks);
	}).catch(function(err) {
		console.log('Error', err);
	})
});


*/
