'use strict';
/*exported  Fleet*/


/*
DataBinde: is called with element id that we wish to enable two-way binding with...


NOTE:
Here I have adopted a vanilla pub/sub mechanism (or Observer pattern)  to create the two-way binding that is an
inherent part of most javascript frameworks. While we will not go as far creating a by directional changing
of data, since our models will only get update when some one enters information from the UI, I still believes
it provides a nice separation of code for our purposes.  To make this a solid pub/sub we would need to invest in
a way to on hook object...or in other words a remove event listener
*/
//I found this one here..//http://www.lucaongaro.eu/blog/2012/12/02/easy-two-way-data-binding-in-javascript/
function DataBinder( objectID ) {
    // Create a simple PubSub object
    var pubSub = {
            callbacks: {},

            on: function( msg, callback ) {
                this.callbacks[ msg ] = this.callbacks[ msg ] || [];
                this.callbacks[ msg ].push( callback );
            },

            publish: function( msg ) {
                this.callbacks[ msg ] = this.callbacks[ msg ] || [];
                for ( var i = 0, len = this.callbacks[ msg ].length; i < len; i++ ) {
                    this.callbacks[ msg ][ i ].apply( this, arguments );
                }
            },

            //Just for the sake of correctness letts remove
            off:function(){
                // Listen to change events and proxy to PubSub
                if ( document.removeEventListener ) {
                    document.removeEventListener('change', changeHandler, false);
                }else{
                    document.detachEvent( 'onchange', changeHandler );
                }
            }
        },

        dataAttr = 'data-bind-' + objectID,
        message = objectID + ':change',

        changeHandler = function( evt ) {
            var target = evt.target || evt.srcElement, // IE8 compatibility
                propName = target.getAttribute( dataAttr );

            if ( propName && propName !== '' ) {
                pubSub.publish( message, propName, target.value );
            }
        };

    // Listen to change events and proxy to PubSub
    if ( document.addEventListener ) {
        document.addEventListener( 'change', changeHandler, false );
    } else {
        // IE8 uses attachEvent instead of addEventListener
        document.attachEvent( 'onchange', changeHandler );
    }

    // PubSub propagates changes to all bound elements
    pubSub.on( message, function( evt, propName, newVal ) {
        var elements = document.querySelectorAll('[' + dataAttr + '=' + propName + ']');
        var tagName;

        for ( var i = 0, len = elements.length; i < len; i++ ) {
            tagName = elements[ i ].tagName.toLowerCase();

            if ( tagName === 'input' || tagName === 'textarea' || tagName === 'select' ) {
                elements[ i ].value = newVal;
            } else {
                elements[ i ].innerHTML = newVal;
            }
        }
    });

    return pubSub;
}



/*
Our cargo will be transported by various vehicles that each have their own cargo capacity.
 */

function Vehicle(autoType, cargoType, cargoCapacity){
    this.autoType         = autoType;
    this.cargoType        = cargoType;
    this.cargoCapacity    = cargoCapacity;
    this.autosAcquired    = 0;
}

Vehicle.prototype.getAutoType = function(){
    return this.autoType;
};

Vehicle.prototype.getCargoType = function(){
    return this.cargoType;
};

Vehicle.prototype.getCargoCapacity = function(){
    return this.cargoCapacity;
};



function Fleet(autoType, cargoType, cargoCapacity) {
    this.autoType        = autoType;
    this.cargoType       = cargoType;
    this.cargoCapacity   = cargoCapacity;
    this.domId           = this.autoType.toLowerCase();

    //call function too create
    this.binder          = new DataBinder(this.domId);
    this.subscribe();
}


/*
 In our case a Fleet Is a Vehicle, so we will inherit the vehicle class above
 */
Fleet.prototype             = new Vehicle();
Fleet.prototype.constructor = Vehicle;
Fleet.prototype.parent      = Vehicle.prototype;





/*
  Because the question  is currently only a matter of counting number of vehicles in a fleet
  we will simple update the parents count. However, if the demands were to change and other various
  attributes of a vehicle would be come important it would be a butter idea to perhaps create another
  vehicle of the type requested...
 */
Fleet.prototype.setVehicleCount = function(n){
    this.autosAcquired = n;
    if(n === 0){
        document.getElementById(this.domId).value = '';
    }
};



Fleet.prototype.getVehicleCount = function(){
    return this.autosAcquired;
};


/*
build a event handler that is will sbuscribe to changes in the fleet elements input value, data-bind- [fleet elements's id]
 */
Fleet.prototype.subscribe = function(){
    var self=this;
    this.binder.on(this.domId + ':change',  function( evt, attrName, newVal) {
            self.setVehicleCount(newVal);
    });
};



/*
 build a event handler that is will sbuscribe to changes in the fleet elements input value, data-bind- [fleet elements's id]
 */
Fleet.prototype.getInnerHtml = function(){
 return '<label class="col-rspns-3  control-label">'+this.autoType+'</label>'+
        '<div class="col-rspns-6">'+
            '<input id="'+ this.domId +'" type="text" onkeypress="return onKeyDown(event)"  data-bind-'+this.domId+'="autosAcquired" class="form-control" placeholder="only numerals  /  vehicle quantity">'+
        '</div>';
};




Fleet.prototype.unsubscribe = function(){
    this.binder.off();
};


