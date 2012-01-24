Array.prototype.clone = function() {
    var isArr = function(elm){
        return String(elm.constructor).match(/array/i) ? true : false;
    }
    var cloner = function(arr){
        var arr2 = arr.slice(0), len = arr2.length;
        for(var i=0; i < len; i++){
            if( isArr(arr2[i]) )
               arr2[i]=cloner( arr2[i] );
        }
        return arr2;
    }
    return cloner(this);
}
