// Tipo para el resultado de la consulta

export class TempProtocoloEnvio {
 
    private idTempProtocoloEnvio : number;
    private numeroProtocolo: string;
    private tipoMuestra: string;
    private idItem : string;
    private paciente : string;
    private sexo: string;
    private sectorSolicitante : string;
    private urgente : string;
    private idMuestra : string;
    private equipo : string;
    private idEfector : number;
    private anioNacimiento : string;

    constructor(){
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

    public getIdTempProtocoloEnvio() : number {
        return this.idTempProtocoloEnvio;
    }

    public getNumeroProtocolo() : string {
        return this.numeroProtocolo;
    }

    public getTipoMuestra() : string {
        return this.tipoMuestra;
    }
    
    public getIdItem() : string {
        return this.idItem;
    }
    
    public getPaciente() : string {
        return this.paciente;
    }
    
    public getSexo() : string {
        return this.sexo;
    }
    
    public getSectorSolicitante() : string {
        return this.sectorSolicitante;
    }
    
    public getUrgente() : string {
        return this.urgente;
    }
    
    public getIdMuestra() : string {
        return this.idMuestra;
    }
    
    public getEquipo() : string {
        return this.equipo;
    }
    
    public getIdEfector() : number {
        return this.idEfector;
    }

    public getAnioNacimiento() : string {
        return this.anioNacimiento;
    }

    
    public setIdTempProtocoloEnvio(v : number) {
        this.idTempProtocoloEnvio = v;
    }

    public setNumeroProtocolo(v : string) {
        this.numeroProtocolo = v;
    }

    public setTipoMuestra(v : string) {
        this.tipoMuestra = v;
    }

    public setIdItem(v : string) {
        this.idItem = v;
    }

    public setPaciente(v : string) {
        this.paciente = v;
    }

    public setSexo(v : string) {
        this.sexo = v;
    }

    public setSectorSolicitante(v : string) {
        this.sectorSolicitante = v;
    }

    public setUrgente(v : string) {
        this.urgente = v;
    }

    public setIdMuestra(v : string) {
        this.idMuestra = v;
    }

    public setEquipo(v : string) {
        this.equipo = v;
    }

    public setIdEfector(v : number) {
        this.idEfector = v;
    }

    public setAnioNacimiento(v : string) {
        this.anioNacimiento = v;
    }

    // #endregion
    
    

    cargar(row : any){
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
