"use strict";
// Tipo para el resultado de la consulta
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempProtocoloEnvio = void 0;
class TempProtocoloEnvio {
    constructor() {
        this.idTempProtocoloEnvio = 0;
        this.numeroProtocolo = "";
        this.tipoMuestra = "";
        this.idItem = "";
        this.paciente = "";
        this.sexo = "";
        this.sectorSolicitante = "";
        this.urgente = "";
        this.idMuestra = "";
        this.equipo = "";
        this.idEfector = 0;
        this.anioNacimiento = "";
    }
    // #region GetterSetter
    getIdTempProtocoloEnvio() {
        return this.idTempProtocoloEnvio;
    }
    getNumeroProtocolo() {
        return this.numeroProtocolo;
    }
    getTipoMuestra() {
        return this.tipoMuestra;
    }
    getIdItem() {
        return this.idItem;
    }
    getPaciente() {
        return this.paciente;
    }
    getSexo() {
        return this.sexo;
    }
    getSectorSolicitante() {
        return this.sectorSolicitante;
    }
    getUrgente() {
        return this.urgente;
    }
    getIdMuestra() {
        return this.idMuestra;
    }
    getEquipo() {
        return this.equipo;
    }
    getIdEfector() {
        return this.idEfector;
    }
    getAnioNacimiento() {
        return this.anioNacimiento;
    }
    setIdTempProtocoloEnvio(v) {
        this.idTempProtocoloEnvio = v;
    }
    setNumeroProtocolo(v) {
        this.numeroProtocolo = v;
    }
    setTipoMuestra(v) {
        this.tipoMuestra = v;
    }
    setIdItem(v) {
        this.idItem = v;
    }
    setPaciente(v) {
        this.paciente = v;
    }
    setSexo(v) {
        this.sexo = v;
    }
    setSectorSolicitante(v) {
        this.sectorSolicitante = v;
    }
    setUrgente(v) {
        this.urgente = v;
    }
    setIdMuestra(v) {
        this.idMuestra = v;
    }
    setEquipo(v) {
        this.equipo = v;
    }
    setIdEfector(v) {
        this.idEfector = v;
    }
    setAnioNacimiento(v) {
        this.anioNacimiento = v;
    }
    // #endregion
    cargar(row) {
        this.setIdTempProtocoloEnvio(row[0].idTempProtocoloEnvio);
        this.setNumeroProtocolo(row[0].numeroProtocolo);
        this.setTipoMuestra(row[0].tipoMuestra);
        this.setIdItem(row[0].iditem);
        this.setPaciente(row[0].paciente);
        this.setSexo(row[0].sexo);
        this.setSectorSolicitante(row[0].sectorSolicitante);
        this.setUrgente(row[0].urgente);
        this.setIdMuestra(row[0].idMuestra);
        this.setEquipo(row[0].equipo);
        this.setIdEfector(row[0].idEfector);
        this.setAnioNacimiento(row[0].anioNacimiento);
    }
}
exports.TempProtocoloEnvio = TempProtocoloEnvio;
