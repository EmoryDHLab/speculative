/*
  This is a dictionary class built by a fantastic user on stack overflow. I use
  it to connect events to their elements on the page
*/
function JSdict() {
    this.Keys = [];
    this.Values = [];
}

// Check if dictionary extensions aren't implemented yet.
// Returns value of a key
if (!JSdict.prototype.getVal) {
    JSdict.prototype.getVal = function (key) {
        if (key == null) {
            return null;
        }
        for (var i = 0; i < this.Keys.length; i++) {
            if (this.Keys[i] == key) {
                return this.Values[i];
            }
        }
        return null;
    }
}


// Check if dictionary extensions aren't implemented yet.
// Updates value of a key
if (!JSdict.prototype.update) {
    JSdict.prototype.update = function (key, val) {
        if (key == null || val == null) {
            throw "Key or Value cannot be null";
        }
        // Verify dict integrity before each operation
        if (keysLength != valsLength) {
            throw "Dictionary inconsistent. Keys length don't match values!";
        }
        var keysLength = this.Keys.length;
        var valsLength = this.Values.length;
        var flag = false;
        for (var i = 0; i < keysLength; i++) {
            if (this.Keys[i] == key) {
                this.Values[i] = val;
                flag = true;
                break;
            }
        }
        if (!flag) {
            throw "Key does not exist";
        }
    }
}

// Check if dictionary extensions aren't implemented yet.
// Adds a unique key value pair
if (!JSdict.prototype.add) {
    JSdict.prototype.add = function (key, val) {
        // Allow only strings or numbers as keys
        if (typeof (key) == "number" || typeof (key) == "string") {
            if (key == null || val == null) {
                throw "Key or Value cannot be null";
            }
            if (keysLength != valsLength) {
                throw "Dictionary inconsistent. Keys length don't match values!";
            }
            var keysLength = this.Keys.length;
            var valsLength = this.Values.length;
            for (var i = 0; i < keysLength; i++) {
                if (this.Keys[i] == key) {
                    throw "Duplicate keys not allowed!";
                }
            }
            this.Keys.push(key);
            this.Values.push(val);
        }
        else {
            throw "Only number or string can be key!";
        }
    }
}

// Check if dictionary extensions aren't implemented yet.
// Removes a key value pair
if (!JSdict.prototype.remove) {
    JSdict.prototype.remove = function (key) {
        if (key == null) {
            throw "Key cannot be null";
        }
        if (keysLength != valsLength) {
            throw "Dictionary inconsistent. Keys length don't match values!";
        }
        var keysLength = this.Keys.length;
        var valsLength = this.Values.length;
        var flag = false;
        for (var i = 0; i < keysLength; i++) {
            if (this.Keys[i] == key) {
                this.Keys.shift(key);
                this.Values.shift(this.Values[i]);
                flag = true;
                break;
            }
        }
        if (!flag) {
            throw "Key does not exist";
        }
    }
}
// -----------------------------------------------------------------------------
function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 ret= (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  return ret.toUpperCase();
}

function setDateAndType(el,date,tp){
  try{
    el.dataset.date=date;
    el.dataset.type=tp;
  }catch(e){
    el.setAttribute("data-date",date);
    el.setAttribute('data-type',tp);
  }
}

function highlight(el,objects){
  var tp=el.getAttribute("data-type"),
      yr=el.getAttribute("data-date");
  for(var i in objects){
    objects[i].highlight(yr,tp);
  }
}
function unhighlight(el,objects){
  var tp=el.getAttribute('data-type'),
      yr=el.getAttribute('data-date');
  for(var i in objects){
    objects[i].unhighlight(yr,tp)
  }
}

function mergeSortByYear(list){
  if (list.length==1){
    return list;
  }
  var i= Math.floor(list.length/2);
  var l1=mergeSortByYear(list.slice(0,i));
  var l2=mergeSortByYear(list.slice(i));
  var l3=[];
  while(l1.length>0 || l2.length>0){
    if (l1.length==0){
      l3.push(l2.shift())
    }else if (l2.length==0) {
      l3.push(l1.shift())
    }else{
      l3.push((l1[0].year<=l2[0].year)? l1.shift():l2.shift());
    }
  }
  return l3
}

function reload(objects,evtSet,two){
  for(var i in objects){
    objects[i].reload(evtSet,two);
  }
}
