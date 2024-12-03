"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
function isDigit(num){
return !isNaN(num)
}

// #region Codifica

/**
* Common ASTM decoding function that tries to guess which kind of data it
* handles.
* If `data` starts with STX character (``0x02``) than probably it is
* full ASTM message with checksum and other system characters.
* If `data` starts with digit character (``0-9``) than probably it is
* fraime of records leading by his sequence number. No checksum is expected
* in this case.
* Otherwise it counts `data` as regular record structure.
* @param data: ASTM data object.
* @return: Array of ASTM records.
**/
//export function decode(data : ArrayBuffer)
/*
export function decode(data){
    let records;
    let bait =  data.slice(0,1).toString();

    /* Si empieza con un digito es un marco */
/* if  (isDigit(bait)){
     records = decodeFrame(data);
     return records;
 }

 let character = data.slice(0,4).toString();
 /* Si empieza con STX es porque es un mensage completo */
/*if (character.startsWith(STX)){ // # may be decode message \x02...\x03CS\r\n
    records = decodeMessage(data);
    return records;
}


// Maybe is a record
return decodeRecord(data);
}


/**
* Decodes complete ASTM message that is sent or received due
* communication routines. It should contains checksum that would be
* additionally verified.
*
* @param {string} message: ASTM message.
* @returns: Array of records

* @throws Error:
* * If ASTM message is malformed.
* * If checksum verification fails. TODO
**/
//export function decodeMessage(message : ArrayBuffer)
/*export function decodeMessage(message ){
    if (!(message.startsWith(STX) && message.endsWith(CRLF))){
        throw new Error('Malformed ASTM message. Expected that it will started with STX and followed by CRLF characters. Got:' + message);
    }
    
    let STXIndex = -1;
    let fraimeMerge = [];
    let fraime = "";
    let msg = message.slice(1); // Remove first STX
    while (msg.indexOf(STX) > -1 ){
        STXIndex = msg.indexOf(STX);
        fraime = message.slice(0,STXIndex + 1);
        fraime = decodeFrame(fraime);
        fraimeMerge.push(fraime);
        
        msg = msg.slice(STXIndex + 1);
        message = message.slice(STXIndex + 1);
    }

    fraime = decodeFrame(message); // Last frame(should contains ETX)
    fraimeMerge.push(fraime);
    
    let recordsS = fraimeMerge.join("");
    
    let recordsArray = recordsS.split(RECORD_SEP);
    //logger.info(recordsArray); // TODO: Remove line
    let records = [];
    for (let i = 0; i < recordsArray.length; i++) {
        records.push(decodeRecord(recordsArray[i]));
    }
    return records;
}

export function decodeFrame(fraime){
    // Decodes ASTM frame
    fraime = fraime.slice(1);
    let fraime_cs = fraime.slice(0,-2);
    fraime = fraime_cs.slice(0,-2);
    // let cs = fraime_cs.slice(-2);
    // let css = makeChecksum(fraime);
    
    // TODO Validate checksum
    // if (cs !== css){
        // throw new Error('Checksum failure: expected ' + cs + ', calculated '+ css);
    // }
    
    if (fraime.endsWith(CR + ETX)){
        fraime = fraime.slice(0,-2);
    }
    else if (fraime.endsWith(ETB)){
        fraime = fraime.slice(0,-1);
    }
    else{
        throw new Error('Incomplete frame data ' + fraime + '. Expected trailing <CR><ETX> or <ETB> chars');
    }
    let seq = fraime.slice(0,1);
    if (!isDigit(seq)){
        throw new Error('Malformed ASTM frame. Expected leading seq number '+ fraime);
    }
    return fraime.slice(1);
}


export function decodeRecord(record : string){
    // Decodes ASTM record message
    let fields  = [];
    let fieldsArray = record.split(FIELD_SEP);
    for (let i = 0; i < fieldsArray.length; i++) {
        let item = fieldsArray[i];
        if (item.indexOf(REPEAT_SEP)> -1){
           // item = decodeRepeatedComponent(item);
        }
        else if (item.indexOf(COMPONENT_SEP)> -1){
           // item = decodeComponent(item);
        }
        else{
            item = item;
        }
        
        if (item){
            fields.push(item);
        }
        else{
            fields.push(null);
        }
    }
    return fields;
}


export function decodeComponent(field : string){
    // Decodes ASTM field component
    let outComponents = [];
    let itemsArray = field.split(COMPONENT_SEP);
     
    for (let i = 0; i < itemsArray.length; i++) {
        let item = itemsArray[i];
        if (item){
            outComponents.push(item);
        }
        else{
            outComponents.push(null);
        }
    }
    return outComponents;
}

export function decodeRepeatedComponent(component : string){
    // Decodes ASTM field repeated component
    let outRepeatedComponent = [];
    let itemsArray = component.split(REPEAT_SEP);
    for (let i = 0; i < itemsArray.length; i++) {
        let item = itemsArray[i];
        outRepeatedComponent.push(decodeComponent(item));
    }
    outRepeatedComponent;
    return outRepeatedComponent
}
// #endregion

// #region DeArrayATexto

/**
* Encodes list of records into single ASTM message, also called as "packed"
* message.
* If you need to get each record as standalone message use :function:`iter_encode`
* instead. TODO
* If the result message is too large (greater than specified `size` if it's
* not null), then it will be split by chunks.
*
* @param records: Array of ASTM records.
* @param {int} size: Chunk size in bytes.
* @param {int} seq: Frame start sequence number.
* @return: List of ASTM message chunks.
**/
/*export function encode(records: ArrayBuffer, encoding?, size?, seq?){
    encoding = typeof encoding !== 'undefined' ? encoding : ENCODING;
    seq = typeof seq !== 'undefined' ? seq : 1;
    size = typeof size !== 'undefined' ? size : 247;
    let msg = encodeMessage(seq, records, encoding);
    // logger.info(msg);
    if (size && msg.length > size){
        // return list(split(msg, size));
        return split(msg, size);
    }
    return [msg];
}


            
/**
* Encodes ASTM message.
* @param {int} seq: Frame sequence number.
* @param records: List of ASTM records.
* @param {string} encoding: Data encoding.
* @return {string}: ASTM complete message with checksum and other control characters.
**/
//export function encodeMessage(seq : number, records : ArrayBuffer, encoding : string) : string 
/*export function encodeMessage(seq : number, records , encoding : string) : string {
    let data ;
    // let data : ArrayBuffer;
    let record;
    for (let i = 0; i < records.byteLength; i++) {
        record = records[i];
        // logger.info(record);
        data.fill(encodeRecord(record,encoding));
    }
    // logger.info(data);
    data.join(RECORD_SEP);
    data = [(seq % 8) , data, CR, ETX].join('');
    return [STX, data, makeChecksum(data), CR, LF].join('');
}

/**
* Encodes single ASTM record.
* @param record: ASTM record. Each`string`-typed item counted as field
               * value, one level nested `list` counted as components
               * and second leveled - as repeated components.
* @param {string} encoding: Data encoding.
* @returns {string}: Encoded ASTM record.
**/
/*export function encodeRecord(record : ArrayBuffer, encoding : string) : string{
    let fields = [];
    
    for (let i = 0; i < record.byteLength; i++) {
        let field = record[i];
        if (Object.prototype.toString.call(field) === '[object Array]'){
            fields.push(encodeComponent(field, encoding));
        } else {
            switch(typeof field){
                case 'undefined' :
                case null :
                    fields.push('');
                    break;
                default :
                fields.push(field);
                break;
            }
        }
    }
    return fields.join(FIELD_SEP); // return FIELD_SEP.join(fields)
}

function encodeComponent(component : string, encoding: string) : string{
    // Encodes ASTM record field components
    let items : string[] = [];
    for (let i = 0; i < component.length; i++) {
        let item = component[i];
        if (Object.prototype.toString.call(item) === '[object Array]'){
            items.push(encodeRepeatedComponent(component, encoding));
            break;
        }else{
            switch(typeof item ){
                case 'string' :  items.push(item); break;
                case 'undefined' : case null :  items.push(''); break;
                default :  items.push(item); break;
            }
        }
    }
    
    // let regex = new RegExp("\\" + REPEAT_SEP + "*$");
    // return items.join(COMPONENT_SEP).replace(regex, ""); // TODO Hacer un rstrip COMPONENT_SEP.join(items).rstrip(COMPONENT_SEP)
    return items.join(COMPONENT_SEP); // TODO Hacer un rstrip COMPONENT_SEP.join(items).rstrip(COMPONENT_SEP)
}


function encodeRepeatedComponent(components : string, encoding : string) : string{
    // Encodes repeated components
    let items : string[] = []
    for (let i = 0; i < components.length; i++) {
        let item = components[i];
        items.push(encodeComponent(item,encoding));
    }
    // let regex = new RegExp("\\" + REPEAT_SEP + "*$");
    return items.join(REPEAT_SEP); //.replace(regex, "");;

}

// #endregion

// #region Auxiliares
/**
* Merges ASTM message `chunks` into single message.
* @param chunks: List of chunks as `bytes`.
**/
/*
export function joinChunks(chunks : string) : string{
    let msg = '1';
    let chunksMsg = [];
    for (let i = 0; i < chunks.length; i++) {
        let dataChunk = chunks[i].slice(2,-5);
        chunksMsg.push(dataChunk);
    }
    msg = msg + chunksMsg.join('') + ETX;
    let completeMsg = [STX, msg, makeChecksum(msg), CRLF]
    return completeMsg.join('');
}

/**
* Split `msg` into chunks with specified `size`.
*
* Chunk `size` value couldn't be less then 7 since each chunk goes with at
* least 7 special characters: STX, frame number, ETX or ETB, checksum and
* message terminator.
*
* @param msg: ASTM message.
* @param {int }size: Chunk size in bytes.
* :yield: `bytes`
**/
/*
function split(msg : string, size : number){
    let outputChunks = [];
    let frame = parseInt(msg.slice(1,2));
    msg = msg.slice(2,-6);
    if (size === null || size < 7){
        throw new Error('Chunk size value could not be less then 7 or null');
    }
    let chunks = make_chunks(msg, size - 7);
    let firstChunks = chunks.slice(0,-1);
    let last = chunks.slice(-1);
    let idx = 0;
    let item : string;
    for(let i = 0; i < firstChunks.length; i++){
        idx = i;
        let chunk = firstChunks[idx];
        item = ([((idx + frame) % 8),chunk,ETB]).join('');
        outputChunks.push(([STX,item,makeChecksum(item),CRLF]).join(''));
    }
    item = ([((idx + frame + 1) % 8),last,CR,ETX]).join('');
    outputChunks.push(([STX,item,makeChecksum(item),CRLF]).join(''));
    return outputChunks;
}

export function make_chunks(msg : string , size : number){
    let chunks : string[] = [];
    let iterElems : string[] = [];
    for(let i = 0; i < msg.length; i++){
        iterElems.push(msg.slice(i,i+1));
    }
    while(iterElems.length) {
        chunks.push(iterElems.splice(0,size).join(''));
    }
    return chunks;
}


export function isChunkedMessage(message : string) : boolean {
    //  Checks plain message for chunked byte.
    if (message.length < 5)
        return false;

    let ETBIndex = message.indexOf(ETB);
    if (ETBIndex > -1){
        if (ETBIndex === message.length -5 )
            return true;
        else
            return false;
    }
    else
        return false;
}

/**
* Calculates checksum for specified message.
* @param message: ASTM message.
* @returns: Checksum value in hex base
**/
/*
export function makeChecksum(message : string) : string {
    let sumData = []
    for(let i = 0; i < message.length; i++){
        sumData.push(message.charCodeAt(i));
   }
    let suma = sumData.reduce((a, b) => a + b, 0) & 0xFF;
    return zfill(suma.toString(16).toUpperCase());
}

export function zfill(value : string) : string {
    let str : string= "" + value;
    let pad : string = "00";
    return pad.substring(0, pad.length - str.length) + str;
}
*/
// #endregion
