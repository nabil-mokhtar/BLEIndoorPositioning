var noble = require('noble');
const EventEmitter =require('events');
const emmitter =new EventEmitter();
var trilat = require('trilat');


noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([],true);
  } else {
    noble.stopScanning();
  }
});

beacons=[];
beacongroup=[];

// // for dummy distance 
// noble.on('discover', (peripheral)=> { 

//   var reabeated =false;

//   console.log('peripheral discovered (' + peripheral.id +
//   ' with address <' + peripheral.address +  ', ' + peripheral.addresstype + '>,' +
//   ' connectable ' + peripheral.connectable + ',' +
//   ' rssi ' + peripheral.rssi + ':');

  
//   beacons.forEach(beacon=>{
//     if(beacon.uuid==peripher.uuid){
//       reabeated=true;
//     }});

//  if(!reabeated){
//   beacons.push({uuid:peripheral.uuid,rssi: peripheral.rssi});
//  }
  
//  console.log(beacons);
//  if (beacons.length>=3){
//    emmitter.emit('beaconsfound',beacons);
//    beacons=[];
//  }
 
// });


//to group beacons which will be filtered later 

noble.on('discover',(peripheral)=>{

  var found=false;
  var completed=0;
  var threshold=30;

  beacongroup.forEach(beacon=>{

    if (beacon.uuid==peripheral.uuid){
      beacon.rssi.push(peripheral.rssi);
      found=true;
      break;
    }
   })


 if (!found){
  beacongroup.push({uuid:peripheral.uuid,rssi:[peripheral.rssi],completed:false})
}

 beacongroup.forEach(beacon=>{
   if (beacon.rssi.length<threshold && !beacon.completed){
      completed++;
      beacon.completed=true;
  }
 })
  // uncompleted ???????? - delete - complete
  // # beacons completed based on environment
 if(completed>=4){
   console.log('#######################################');
   console.log(beacongroup);
   beacongroup=[];
   emmitter.emit('groupcompleted');
   console.log('#######################################');}

})




// HISTOGRAM BUILDING STEP
emmitter.on('groupcompleted',(group)=>{

  var histvoting=5;

  var histogram = new Array(group.length);
  for (var i = 0; i < histogram.length; i++) {
  x[i] = new Array(10);
  }
  var i=0;

  group.forEach(beacon=>{

  var  min = Math.min.apply(null, beacon.rssi),
  max = Math.max.apply(null, beacon.rssi);
 
    // to apply 10 index based histogram
  beacon.rssi.forEach(rssi=>{
    j=Math.floor(10*((max-rssi)/(max-min)));
    histogram[i][j]+=1;
  
  })
i++; })

for (var i=0;i<groups.length;i++){
histogram[i]
}


})





emmitter.on('beaconsfound',(beacons)=>{

  var active_ble=[beacons[0].rssi,beacons[1].rssi,beacons[2].rssi].sort();

  beacons.forEach(beacon=>{

    if(beacon.rssi>active_ble[0]){
      active_ble[0]=beacon.rssi;
      active_ble.sort();
    }

  });

  emmitter.emit('rssiready',active_ble);
})  



emmitter.on('rssiready',(active_ble)=>{

  var distance=[];
  const rssi_at1m=-59;
  var i=0;
  const e=2.3;

  active_ble.forEach(ble=>{
     ratio=ble/rssi_at1m;
    if((ratio)<1){
      distance[i]=Math.pow(ratio,10);
      i++;
    }else{
      distance[i]=Math.pow(10,(rssi_at1m-ble)/Math.pow(10,e));
    }


  })

  emmitter.emit('distanceready',distance);

})



emmitter.on('distanceready',(distance)=>{
  console.log('first distance = '+distance[0]);
  console.log('second distance = '+distance[1]);
  console.log('third distance = '+distance[2]);

})









