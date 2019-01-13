/*
Author: Robert Lie (mobilefish.com)

The mam_receive.js file extracts stored data from the tangle using MAM.
This extracted data will be displayed on the screen.
This file will work on a computer or Raspberry Pi.
Instead of this file you can also use another tool to display the data:
https://www.mobilefish.com/services/cryptocurrency/mam.html (Select option: Data receiver)

Usage:
1)  You can change the default settings: MODE or SIDEKEY
    If you do, make the same changes in mam_publish.js and mam_sensor.js files.
2)  Start the app: node mam_receive.js <root>

More information:
https://www.mobilefish.com/developer/iota/iota_quickguide_raspi_mam.html
*/

const Mam = require('./lib/mam.client.js');
const IOTA = require('iota.lib.js');
const iota = new IOTA({ provider: 'https://nodes.devnet.thetangle.org:443'});

const MODE = 'public'; // public, private or restricted
//const SIDEKEY = 'tmmiot-iota-sideky'; // Enter only ASCII characters. Used only in restricted mode

let root;
let key;

// Check the arguments
const args = process.argv;
if(args.length !=3) {
    console.log('Missing root as argument: node mam_receive.js <root>');
    process.exit();
} else if(!iota.valid.isAddress(args[2])){
    console.log('You have entered an invalid root: '+ args[2]);
    process.exit();
} else {
    root = args[2];
}

// Initialise MAM State
let mamState = Mam.init(iota);

// Set channel mode
if (MODE == 'restricted') {
    key = iota.utils.toTrytes(SIDEKEY);
    mamState = Mam.changeMode(mamState, MODE, key);
} else {
    mamState = Mam.changeMode(mamState, MODE);
}

// Receive data from the tangle
const executeDataRetrieval = async function(rootVal, keyVal) {
    /*
    var resp = await Mam.fetchSingle(rootVal, MODE, keyVal, function(data) {
        var json = iota.utils.fromTrytes(data);
        console.log(json);
        
    });*/
    var resp = await Mam.fetchSingle(rootVal, MODE, keyVal);

    //console.log(JSON.stringify(resp));
    //console.log("payload % 2: " +((resp.payload).length % 2))    
    //console.log("payload length: " + (resp.payload).length)
    console.log(iota.utils.fromTrytes(resp.payload))
    console.log(resp.nextRoot)
    //console.log("done")
    
    //executeDataRetrieval(resp.nextRoot, keyVal);
}

executeDataRetrieval(root, key);
