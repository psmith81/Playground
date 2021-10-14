function intake(val){
    
    var ele = document.getElementById("results");       // Show if input is numeric or not
    var pval_ele = document.getElementById("FracVal");  // Specified closes fractional value : 1 / pval
    var t1r1c2_ele = document.getElementById("T1R1C2"); // Input string
    var t1r2c2_ele = document.getElementById("T1R2C2"); // Whole number part of input
    var t1r3c2_ele = document.getElementById("T1R3C2"); // Fractional decimal portion of input
    var t1r4c2_ele = document.getElementById("T1R4C2"); // Conditioned value to be solved
    var t1r5c2_ele = document.getElementById("T1R5C2"); // Resultant cell 
    var ResStr_ele = document.getElementById("ResStr"); // Resultant field
    var RstFmt_ele = document.getElementById("RstFmt"); // Checkbox to indicate Whether or to include html formatting in results 
    var tol_ele = document.getElementById("tol");       // Shows the tolerance used when calculating closed fractional decimal

    var nval;
     
    if (isNumeric(val)) {
        var nval = Number(val);
        var ival = Math.floor(nval);
        var fval = nval - Math.trunc(nval); //(nval - parseInt(nval)).toPrecision(4);
        var pval = pval_ele.value;
        var rstFmt = RstFmt_ele.checked;
        var appear = "standard";
        if (rstFmt){
            appear = "enhance";
        } 
        logit("checked: " + rstFmt + ", appear: " + appear);

        ele.innerHTML = "Is Numeric";
        t1r1c2_ele.innerHTML = nval;
        t1r2c2_ele.innerHTML = ival;
        t1r3c2_ele.innerHTML = fval;

        logit("nval: " + nval + ", pval: " + pval);
        let cond = condition(nval,pval);
        nval = cond[0];
        t1r4c2_ele.innerHTML = nval;
        tol_ele.innerHTML = cond[1];
        logit(nval);
        
        var rst = float_to_fraction(nval);
        var rsts = buildRstStr(rst[0],rst[1],rst[2],appear);
        logit("Result: " + rsts);
        t1r5c2_ele.innerHTML = rsts;
        ResStr_ele.innerHTML = rsts;

    } else {
        ele.innerHTML = "Not Numeric";
        t1r1c2_ele.innerHTML = "nonNumeric";
        t1r2c2_ele.innerHTML = "-";
        t1r3c2_ele.innerHTML = "-";
        t1r4c2_ele.innerHTML = "-";
        tol.innerHTML = "-";
        t1r5c2_ele.innerHTML = val;
        ResStr.innerHTML = val;
    }

}

function buildRstStr(w,n,d,appearance="enhance"){
    logit("Whole number: " + w);
    logit("Numerator: " + n);
    logit("Denominator: " + d);
    var rstS = null;

    if ((n == 1 && d == 1) || n ==0){
        rstS = w;
    } else {
        logit(appearance.toLowerCase());
        if (appearance.toLowerCase() == "enhance"){
            rstS = w + "-" + "<sup>" + n + "</sup>&frasl;<sub>" + d + "</sub>";
        } else {
            rstS = w + "-" + n + "/" + d;
        }
    }
    return rstS;
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function tolval(val) {
    var rst = 1.0 /val*0.5;
    return rst; 
}

function float_to_fraction(x, error = 0.000001) {
    // This uses the Stern-Brocot tree to converge on a solution. This algorithm was taken from btilly's answer  
    // on stack overflow to the question "Algorithm for simplifying decimal to fractions". 
    // This can be found at the link: https://stackoverflow.com/questions/5124743/algorithm-for-simplifying-decimal-to-fractions .
    //
    // Python script converted to Javascript 
    // By: Peter Smith
    // Other modifications:
    //   - The resultant is returned in components, whole number, Numerator and Denominator rather than just the a numerator and denominator.
    //   - Add a console logging feature to trace progress.  The console.log in the logit function can be commented out to prevent 
    //     the console writes.  

    n = Math.floor(x);
    logit("Error: " + error);
    x = x - n;
    logit("x: " + x);
    if (x < error) {
        logit("returning on x < error where x: " + x);
        return [n, 1, 1];
    } else if (1 - error < x) {
        logit("returning on 1 - error < x where x: " + x);
        return [n + 1, 1, 1];
    }
    // The lower fraction is 0 / 1
    lower_n = 0;
    lower_d = 1;
    // The upper fraction is 1 / 1
    upper_n = 1
    upper_d = 1
    logit("set initial n and d values Lower(" + lower_n + "," + lower_d + ") upper(" + upper_n + "," + upper_d + ")");

    var flg = true;
    let itr = 0;
    while (flg) {
        itr += 1;
        logit("Walking Stern-Brocot Tree, Iteration: [" + itr + "]");
        //# The middle fraction is(lower_n + upper_n) / (lower_d + upper_d)
        middle_n = lower_n + upper_n;
        logit("middle_n: " + middle_n);
        middle_d = lower_d + upper_d;
        logit("middle_d: " + middle_d);

        if (middle_d * (x + error) < middle_n) {
            //# If x + error < middle
            //# middle is our new upper
            upper_n = middle_n;
            upper_d = middle_d;
        } else if (middle_n < (x - error) * middle_d) {  
            // # Else If middle < x - error
            //# middle is our new lower
            lower_n = middle_n;
            lower_d = middle_d;
        } else {  //# Else middle is our best fraction
            flg = false;
            logit("Solution Found!");
        }
    }
    logit("returning: " + (n * middle_d) + (middle_n + middle_d));
    return [n, middle_n, middle_d];
}

function condition(x, d) {
    logit("condition - x: " + x + ", d: " + d);
    n = Math.floor(x); // Get Interger value
    x = x - n; // Get fractional decimal value
    logit("n: " + n + ", x: " + x);
    var v = [];
    for (let i = 0; i <= d; i++) {
        logit(i);
        v[i] = (1 / d) * i;
        logit(v[i]);
    }
    logit(v);
    let i = 0
    var error = 1 / d * 0.5;
    logit(error);
    logit("x: " + x + ", lower: " + (v[i] - error) + ", upper: " + (v[i] + error));

    while (x > (v[i] - error) && x > (v[i] + error)) {
        logit("x: " + x + ", lower: " + (v[i] - error) + ", upper: " + (v[i] + error));
        i += 1;
    }

    logit("cond rst: " + v[i]);
    if (v[i] == 1) {
        n += 1;
        return (n);
    }
    return [n + v[i],error];
}

function logit(msg){

    console.log (msg);

}