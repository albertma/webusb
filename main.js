const x = document.getElementById('js-button')

function getWebusb(filters) {
  navigator.usb.getDevices().then(function(devices) {
    if (devices.length) {
      devices.map(device => {
        console.log(device.productName)
        console.log(device.manufacturerName)
      })
    }
  })
}
x.onclick = function() {
  const vid = parseInt(document.getElementById('js-vid').value, 16)
  const pid = parseInt(document.getElementById('js-pid').value, 16)
  let device = null

  navigator.usb
    .requestDevice({ filters: [{ vendorId: vid, productId: pid }] })
    .then(selectedDevice => {
      device = selectedDevice
      return device.open()
    })
    .then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
    .then(() => device.claimInterface(2)) // Request exclusive control over interface #2.
    .then(() =>
      device.controlTransferOut({
        requestType: 'class',
        recipient: 'interface',
        request: 0x22,
        value: 0x01,
        index: 0x02
      })
    ) // Ready to receive data
    .then(() => device.transferIn(1, 64)) // Waiting for 64 bytes of data from endpoint #5.
    .then(result => {
      let decoder = new TextDecoder()
      console.log('Received: ' + decoder.decode(result.data))
    })
    .catch(error => {
      console.log(error)
    })
  navigator.usb.getDevices().then(function(devices) {
    if (devices.length) {
      devices.map(device => {
        console.log(device.productName)
        console.log(device.manufacturerName)
      })
    }
  })
}
