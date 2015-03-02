'use strict';

/*exported getFirst100Primes */

function getFirst100Primes() {
    var first100Primes = [];
    var n = 2;
    do {
        var sqrtn = Math.sqrt(n);
        var isPrime = true;

        for (var i = 2; i <= sqrtn; i++){
            if (n % i === 0) {
                isPrime = false;
                break;
            }
        }

        if (isPrime){
            first100Primes.push(n);
            isPrime = true;
        }
        n++;
    } while (first100Primes.length < 100);


   return first100Primes;
}


