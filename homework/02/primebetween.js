function isPrime(n){
    if(n==1){
        return 1;
    }else{
        for(var i=2;i<n;i++){
            if(n%i==0)
            return 0;
        }
    }
    return 1;

}

function primeBetween(a,b){
    for(var i=a;i<=b;i++){
        if(isPrime(i)){
            console.log(i);
        }
    }
}

primeBetween(3,15)