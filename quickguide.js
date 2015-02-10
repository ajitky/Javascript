DAY 1:
=========

// Hoisting - Function and Variable

var myvar = 'my value'; 
  
(function() { 
  alert(myvar);
  var myvar = 'local value'; 
})();


foo(); // TypeError "foo is not a function"
bar(); // valid
baz(); // TypeError "baz is not a function"
spam(); // ReferenceError "spam is not defined"

var foo = function () {}; // anonymous function expression ('foo' gets hoisted)
function bar() {}; // function declaration ('bar' and the function body get hoisted)
var baz = function spam() {}; // named function expression (only 'baz' gets hoisted)

foo(); // valid
bar(); // valid
baz(); // valid
spam(); // ReferenceError "spam is not defined"


All declarations, both functions and variables, are hoisted to the top of the containing scope, before any part of your code is executed. 
Functions are hoisted first, and then variables. 
Function declarations have priority over variable declarations, but not over variable assignments.


// Replacement for typeOf
Object.prototype.toString.call(objectInstance);     // returns [object XYZ]


// Closure
// 1st way

var a = 'a';
function F(){
    var b = 'b';
    return function N(){
    	var c = 'c';
    	console.log(a);
        console.log(b);
        console.log(c);
        return true;
    }
}

a = F()();
//a= F(); a();

// 2nd way

var a = 'a';
function F(){
    var b = 'b';
    function N(){
    	var c = 'c';
    	console.log(a);
        console.log(b);
        console.log(c);
        return true;
    }
    a = N;
}

F();
a();

// Loop problem

var a = 'a';
function F(){
    var b = 'b', arr = [];
    for (i = 0; i < 3; i++){
        arr[i] = function(){
            return i;
        }
    }
    return arr;
}

a = F();
console.log(a[0]());
console.log(a[1]());
console.log(a[2]());

// Loop solution

var a = 'a';
function F(){
    var b = 'b', arr = [];
    /*function mkClosure(x){
        return function(){
            return x;
        }
    }*/
    for (i = 0; i < 3; i++){
    	//arr[i] = mkClosure(i);
        arr[i] = (function(x){
            return function(){
                return x;
            }
        })(i)
    }
    return arr;
}

a = F();
console.log(a[0]());
console.log(a[1]());
console.log(a[2]());


//OOJS
function ParentClass(param){
    this.prop = 'prop value';
    this.mtd = function(){
        console.log(this.prop);
        console.log(this.constructor.uber); // UBER
        return this;
    }
    this.anotherMtd = function(){
        console.log(this.prop);
        console.log(this.constructor.uber); // UBER
    }
    this.param = param;
    // pass-by-reference complex property
    this.ComplexProperty = {};
}

var myObj = new ParentClass('aarrgument');
console.log(myObj.param);

myObj.mtd.anotherMtd

function SubClass(){
    // because the object is pass-by-reference, JS doesn't return a unique copy of it; rather, it returns a reference to the original object contained in the Prototype. When you then update a key within that object reference, you are altering the Prototype itself.
    // Prototype chain is live with the exception of when you completely replace the prototype object.
    // When you overwrite the prototype, it is a good idea to reset the constructor property.
    // call super constructor from sub-class constructor to ensure that sub-class instance gets unique copy of all properties (simple/complex)
    ParentClass.call(this);
    this.subProp = 'sub prop value';
    this.subMtd = function(){
        console.log(this.subProp);
    }
    var parentMtd = this.mtd;   // keep parent method ref
    this.mtd = function(){      // override parent method
        parentMtd.apply(this)   // call parent method
    }
}

SubClass.prototype = new ParentClass();
SubClass.prototype.constructor = SubClass;
SubClass.uber = ParentClass.prototype;  // UBER

var subObjA = new SubClass();
var subObjA = new SubClass();
subObjA.ComplexProperty.AKey = "FromA";
subObjB.ComplexProperty.BKey = "FromB";
console.log(subObjA.mtd());
console.log(subObjA);
console.log(subObjB);





DAY 2:
=========

//Call, Apply
var x, o1, o2;
x = 4;
o1 = {x: 2};
o2 = {x: 7};
 
f = function(m, n) {return m * n * this.x;};
 
console.log(f(3, 1)); 
console.log(f.call(o1,3, 1));
console.log(f.apply(o2,[3, 1]));



//Class Pattern
function Constructor(param){
    var privateVar = 'PRIVATE VAR, ';
    var privateVar2 = param;
    var that = this;
    var privateMtd = function(){
        return 'PRIVATE MTD, ' + privateMtd2();
    }
    function privateMtd2(){
        console.log('SCOPE: '+this);
        return 'PRIVATE MTD 2, ' + privateVar + that.publicVar + that.protoProp + Constructor.staticProp;
    }
    this.publicVar = 'PUBLIC VAR, ';
    this.privilegedMtd = function(){
        return 'PRIVILEGED MTD, ' + this.publicVar + privateMtd();
    }
}
Constructor.prototype.publicMtd = function(){
    return 'PUBLIC MTD, '+ this.privilegedMtd();
}
Constructor.prototype.protoProp = 'PROTOTYPE PROP, ';
Constructor.staticProp = 'STATIC PROP, ';

var myObj = new Constructor();
myObj.publicMtd();


//Anonymous Closures
(function () {
    // ... all vars and functions are in this scope only
    // still maintains access to all globals
})();

//Global Import
(function ($, YAHOO) {
    // now have access to globals jQuery (as $) and YAHOO in this code
})(jQuery, YAHOO);

//Module Export
var MODULE = (function () {
    var my = {},
        privateVariable = 11;
    
    function privateMethod() {
        console.log('privateMethod');
    }
    
    my.moduleProperty = 22;
    my.moduleMethod = function () {
        console.log('moduleMethod 1, ' + my.moduleProperty);
        return 'moduleMethod 1';
    };
    
    return my;
}());

//Augmentation
var MODULE = (function (my) {
    my.anotherMethod = function () {
        console.log('anotherMethod');
    };

    return my;
}(MODULE));

//Loose Augmentation
var MODULE = (function (my) {
    // add capabilities...
    my.oneMore = function () {
        console.log('oneMore');
    };
    
    return my;
}(MODULE || {}));

//Tight Augmentation
var MODULE = (function (my) {
    var old_moduleMethod = my.moduleMethod;
    my.moduleMethod = function () {
        // method override, has access to old through old_moduleMethod
        console.log('moduleMethod 2, ' + old_moduleMethod());
    };
    
    return my;
}(MODULE));











//Cloning and Inheritance
var MODULE_TWO = (function (old) {
    var my = {},
        key;
    
    for (key in old) {
        if (old.hasOwnProperty(key)) {
            my[key] = old[key];
        }
    }
    
    var super_moduleMethod = old.moduleMethod;
    my.moduleMethod = function () {
        // override method on the clone, access to super through super_moduleMethod
    };
    
    return my;
}(MODULE));

//Cross-File Private State
var MODULE = (function (my) {
    var _private = my._private = my._private || {},
        _seal = my._seal = my._seal || function () {
            delete my._private;
            delete my._seal;
            delete my._unseal;
        },
        _unseal = my._unseal = my._unseal || function () {
            my._private = _private;
            my._seal = _seal;
            my._unseal = _unseal;
        };
    
    // permanent access to _private, _seal, and _unseal
    
    return my;
}(MODULE || {}));

//Sub-modules
MODULE.sub = (function () {
    var my = {};
    // ...
    
    return my;
}());


//Example
var module = (function(my) {
    my._unseal && my._unseal();
    var _private = my._private = my._private || {};
    my._seal = my._seal || function() {
        delete my._private;
    };
    my._unseal = my._unseal || function() {
        my._private = _private;
    };
    _private["part1"] = "part1";
    console.log(my._private["part1"]);
    console.log(my._private["part2"]);
    my._seal();
    return my;
})(module || {});

console.log(typeof module._private);

var module = (function(my) {
    my._unseal && my._unseal();
    var _private = my._private = my._private || {};
    my._seal = my._seal || function() {
        delete my._private;
    };
    my._unseal = my._unseal || function() {
        my._private = _private;
    };
    _private["part2"] = "part2" + _private["part1"];
    console.log(my._private["part1"]);
    console.log(my._private["part2"]);
    console.log(my._private);
    my._seal();
    return my;
})(module || {});



// Augmenting Built-in Objects
// 'this' represents object being augmented i.e. string
if (!String.prototype.reverse) {
    String.prototype.reverse = function() {
        return Array.prototype.reverse.apply(this.split('')).join('');
    }
}



function extend(Child, Parent) {
    var F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
Child.uber = Parent.prototype;
}

