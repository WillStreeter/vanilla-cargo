'use strict';

//these declarations prevent the  jshint from throwing error and warnings for some harmless js conventions
/*global Fleet */
/*global getFirst100Primes */
/*global buildBlockQuotes */
/*exported  buildPageElements*/
/*exported  onKeyDown */

var someBackEndData = '{"vehicles":['+
                           ' {'+
                           '    "autoType":"SportsCar",'+
                           '    "cargoType":"small trunk",'+
                           '    "cargoCapacity":100'+
                           ' },'+
                           ' {'+
                           '     "autoType":"FamilyCar",'+
                           '     "cargoType":"large trunk",'+
                           '     "cargoCapacity":300'+
                           ' },'+
                           ' {'+
                           '     "autoType":"Truck",'+
                           '     "cargoType":"2 doors, bed",'+
                           '     "cargoCapacity":1500'+
                           ' },'+
                           ' {'+
                           '     "autoType":"MiniVan",'+
                           '     "cargoType":"small rear storage area",'+
                           '     "cargoCapacity":200'+
                           ' },'+
                           ' {'+
                           '     "autoType":"CargoVan",'+
                           '     "cargoType":"large rear storage area",'+
                           '     "cargoCapacity":800'+
                           ' }'+
                       ' ]}';


var fleetOfVehicles  = [];

var currentCargo     = 0;
var cargoWarningMssg = false;



/*
   Utility class used to remove child nodes from element...
 */

var emptyChildElements = function (element) {
    var node = element;
    while (element.hasChildNodes()) {              // selected elem has children

        if (node.hasChildNodes()) {                // current node has children
            node = node.lastChild;                 // set current node to child
        }
        else {                                     // last child found
            console.log(node.nodeName);
            node = node.parentNode;                // set node to parent
            node.removeChild(node.lastChild);      // remove last node
        }
    }
};

//bool  true = add  false = remove
var classUpdater  = function(elementId, className, bool){
    switch(elementId){
        case 'cardrotator':
            var cardElement = document.getElementById(elementId);
            if(bool){
                cardElement.classList.add(className);
            }else{
                cardElement.classList.remove(className);
            }
            break;
        case 'cargoWarning':
            document.getElementById(elementId).setAttribute('style', className);
            break;
    }
};

/*
   after inputting acceptable amounts for vehicle types and cargo amount
 */
function setCargoResultHtml(entry){
    var emptyLoadRow = document.createElement('tr');
    emptyLoadRow.innerHTML = '';
    if(currentCargo>0 || entry.getVehicleCount()>0){
        for(var i= 0; i < entry.getVehicleCount(); ++i){
            if(currentCargo>0){
                var cargoLbs   = currentCargo  - entry.getCargoCapacity();
                cargoLbs = (cargoLbs <0)? entry.getCargoCapacity() + cargoLbs: entry.getCargoCapacity();
                var payloadRow = document.createElement('tr');
                payloadRow.innerHTML = '<td> a '+entry.getAutoType()+'</td>'+
                                       '<td> with '+cargoLbs+' lbs</td>';
                document.getElementById('payloadOutput').appendChild(payloadRow);
                currentCargo = ((currentCargo  - entry.getCargoCapacity()) < 0)?0:(currentCargo  - entry.getCargoCapacity());
            }else{
                emptyLoadRow.innerHTML ='<td> a '+entry.getAutoType()+'</td><td> with 0 lbs</td>';
                document.getElementById('payloadOutput').appendChild(emptyLoadRow);

            }
        }
    }else{
        emptyLoadRow.innerHTML ='<td> a '+entry.getAutoType()+'</td><td> with 0 lbs</td>';
        document.getElementById('payloadOutput').appendChild(emptyLoadRow);
    }
}





function onKeyDown(e) {
    if (e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 37 || e.keyCode === 39) {
        return true;
    }
    if (e.which < 48 || e.which > 57) {
        return false;
    }
    if (cargoWarningMssg) {
        classUpdater('cargoWarning', 'visibility:hidden;', false);
        cargoWarningMssg = false;
    }
}


function doCalculate(e){
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    console.log('cargo ='+document.getElementById('cargoWeight').value );
    if( isNaN(parseInt(document.getElementById('cargoWeight').value, 10))){
        if(!cargoWarningMssg){
            classUpdater('cargoWarning', 'visibility:visible', true);
        }
        cargoWarningMssg = true;
    }else{
        currentCargo = parseInt(document.getElementById('cargoWeight').value, 10);
        emptyChildElements(document.getElementById('outputAmnt'));
        emptyChildElements(document.getElementById('payloadOutput'));
        document.getElementById('outputAmnt').innerHTML ='<label > allocating <b>'+currentCargo+'</b> lbs of cargo</label> ';
        for(var i=0;i<fleetOfVehicles.length;++i){
            setCargoResultHtml(fleetOfVehicles[i]);
        }
        classUpdater('cardrotator', 'flipped', true);
    }
    document.getElementById('cargoRmng').innerHTML = '<label class="rmng-cargo-lbl">  we have <b>'+
                                                       currentCargo +'</b> lbs of cargo left over </label>';

}

function resetUpInputView(e){
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    document.getElementById('cargoWeight').value ='';
    for(var i=0;i<fleetOfVehicles.length;++i){
       fleetOfVehicles[i].setVehicleCount(0);
    }
    classUpdater('cardrotator', 'flipped', false);
}


function doTest2(e){
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    var element = document.querySelector('[contenteditable]');
    var blocks = buildBlockQuotes(element.textContent);
    emptyChildElements( document.getElementById('blckRslt'));
    document.getElementById('blckRslt').appendChild(blocks);
}




function doTest1(e){
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    emptyChildElements(document.getElementById('primeRslt'));
    document.getElementById('primeRslt').innerHTML= '<code class="text-muted">'+ getFirst100Primes().join(', ' )+'</code>';
}


function buildPageElements(){
    //first we will mock the return of the type of vehicles in our motorcade and
    //crete a list of object that we will use to build up our motorcade
    var vehicleTypes = JSON.parse(someBackEndData).vehicles;

    for(var i=0; i < vehicleTypes.length;++i){
        fleetOfVehicles.push( new Fleet(vehicleTypes[i].autoType,vehicleTypes[i].cargoType, vehicleTypes[i].cargoCapacity));
        var newFormElement = document.createElement('div');
        newFormElement.className = 'form-group';
        newFormElement.innerHTML = fleetOfVehicles[i].getInnerHtml();
        document.getElementById('cargoInput').appendChild(newFormElement);
    }

    var cargoInputElement = document.createElement('div');
    cargoInputElement.className = 'form-group';
    cargoInputElement.innerHTML = '<label  class="col-rspns-3  control-label">Cargo (lbs.)</label>'+
                                  '<div class="col-rspns-6">'+
                                        '<input id="cargoWeight" type="text"  type="number" onkeypress="return onKeyDown(event)" value="" class="form-control" id="ttlCargo_id" placeholder="lbs">'+
                                  '</div>'+
                                  '<label id="cargoWarning" class="col-rspns-10-offset-1 cargo-message" style="visibility:hidden;">Enter cargo Amount to Proceed</label>';

    document.getElementById('cargoInput').appendChild(cargoInputElement);

    var btnElement         = document.createElement('button');
    btnElement.type        = 'button';
    btnElement.className   = 'btn btn-success';
    btnElement.textContent = 'Calculate Cargo Weight';

    document.getElementById('cargoInput').appendChild(btnElement);
    btnElement.addEventListener('click', doCalculate);

    var closeBtnElement = document.getElementById('closeBack');
    closeBtnElement.addEventListener('click',resetUpInputView);

    document.getElementById('primeBtn').addEventListener('click', doTest1);

    document.getElementById('cntntEdtblBtn').addEventListener('click', doTest2);
}

