function decToFraction(decVal, denomVal, appear="enhance"){

    if (isNumeric(decVal)){
        //condition string
        console.log("Input is numeric");
        var nval = Number(decVal);
        var ival = Math.floor(nval);
        var fval = nval - Math.trunc(nval); //(nval - parseInt(nval)).toPrecision(4);
        var pval = denomVal; 

        let cond = condition(nval, pval);
        nval = cond[0];
        var rst = float_to_fraction(nval);
        var rsts = buildRstStr(rst[0], rst[1], rst[2], appear);

        return rsts;
    } else {
        // wont be able to process input 
        console.log("input error, non-numeric");
        return decVal;
    }

    function isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    function condition(x, d) {
        //console.log("condition - x: " + x + ", d: " + d);
        n = Math.floor(x); // Get Interger value
        x = x - n; // Get fractional decimal value
        //console.log("n: " + n + ", x: " + x);
        var v = [];
        for (let i = 0; i <= d; i++) {
            //console.log(i);
            v[i] = (1 / d) * i;
            //console.log(v[i]);
        }
        //console.log(v);
        let i = 0
        var error = 1 / d * 0.5;
        //console.log(error);
        //console.log("x: " + x + ", lower: " + (v[i] - error) + ", upper: " + (v[i] + error));

        while (x > (v[i] - error) && x > (v[i] + error)) {
            //console.log("x: " + x + ", lower: " + (v[i] - error) + ", upper: " + (v[i] + error));
            i += 1;
        }

        console.log("cond rst: " + v[i]);
        if (v[i] == 1) {
            n += 1;
            return (n);
        }
        return [n + v[i], error];
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
        //   - Add a console logging feature to trace progress.  The console.log in the console.log function can be commented out to prevent 
        //     the console writes.  

        n = Math.floor(x);
        console.log("Error: " + error);
        x = x - n;
        console.log("x: " + x);
        if (x < error) {
            console.log("returning on x < error where x: " + x);
            return [n, 1, 1];
        } else if (1 - error < x) {
            console.log("returning on 1 - error < x where x: " + x);
            return [n + 1, 1, 1];
        }
        // The lower fraction is 0 / 1
        lower_n = 0;
        lower_d = 1;
        // The upper fraction is 1 / 1
        upper_n = 1
        upper_d = 1
        console.log("set initial n and d values Lower(" + lower_n + "," + lower_d + ") upper(" + upper_n + "," + upper_d + ")");

        var flg = true;
        let itr = 0;
        while (flg) {
            itr += 1;
            console.log("Walking Stern-Brocot Tree, Iteration: [" + itr + "]");
            //# The middle fraction is(lower_n + upper_n) / (lower_d + upper_d)
            middle_n = lower_n + upper_n;
            console.log("middle_n: " + middle_n);
            middle_d = lower_d + upper_d;
            console.log("middle_d: " + middle_d);

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
                console.log("Solution Found!");
            }
        }
        console.log("returning: " + (n * middle_d) + (middle_n + middle_d));
        return [n, middle_n, middle_d];
    }

    function buildRstStr(w, n, d, appearance = "enhance") {
        console.log("Whole number: " + w);
        console.log("Numerator: " + n);
        console.log("Denominator: " + d);
        var rstS = null;

        if ((n == 1 && d == 1) || n == 0) {
            rstS = w;
        } else {
            console.log(appearance.toLowerCase());
            if (appearance.toLowerCase() == "enhance") {
                rstS = w + "-" + "<sup>" + n + "</sup>&frasl;<sub>" + d + "</sub>";
            } else {
                rstS = w + "-" + n + "/" + d;
            }
        }
        return rstS;
    }

}

function intake(val){
    console.log("inside intake");
    var result_elm = document.getElementById("Results");
    result_elm.innerHTML = decToFraction(val,16,"enhance");
}