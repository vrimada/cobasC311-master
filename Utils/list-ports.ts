import { SerialPort } from 'serialport'
SerialPort.list().then(function(ports: any[]){
  ports.forEach(function(port){
    console.log("Port: ", port);
  })
});

/* EJEMPLOS DE IMPRESION

Port:  {
  path: 'COM1',
  manufacturer: 'Electronic Team',
  serialNumber: undefined,
  pnpId: 'VSBC9\\DEVICES\\0000',
  locationId: 'Electronic Team Virtual Serial Bus',
  friendlyName: 'Electronic Team Virtual Serial Port (COM1->COM2)',
  vendorId: undefined,
  productId: undefined
}
Port:  {
  path: 'COM2',
  manufacturer: 'Electronic Team',
  serialNumber: undefined,
  pnpId: 'VSBC9\\DEVICES\\0001',
  locationId: 'Electronic Team Virtual Serial Bus',
  friendlyName: 'Electronic Team Virtual Serial Port (COM2->COM1)',
  vendorId: undefined,
  productId: undefined
}

*/