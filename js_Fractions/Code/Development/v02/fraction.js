//------------------------------------------------------------------------------------------------------
// decToFraction: decimal to fraction
// Written By: Peter Smith
//         On: Oct. 15, 2021
//
// This function takes the decimal portion of a number and converts to the nearest 
// fractional equivalent to the provided denominator value then returns the a value string.
// 
// Inputs:
//     decVal:   real number value
//     denomVal: denominator of closest fractional value.  
//     appear:   Appearance, enhance = return string code in HTML sup and sub tags. standard = string.  
//
// Output:
//     returns converted value as a string. If appearance is enhance will wrap fraction in HTML
//     sup and sub tags.  If the value is non-numeric returns the input value unchanged. 
//
// Code Flow:
//    * Determine if input is numeric, if not return input value.
//    * change the decimal portion to the closest fractional decimal interval.  (eg. given you are looking
//      for a frication to the closest 1/8 or 0.125  an input value of 0.123 is changed to 0.125.)
//    * Use a Stern-Brocot tree to iterate to fractional numerator and denominator. 
//    * build string in the form of X-n/d, wrap in HTML if option selected, return value.
//
//    Because the decimal portion is changed to an interval of the specified fraction the Stern-Brocot tree
//    will converge on that fractional interval.  
//------------------------------------------------------------------------------------------------------

function decToFraction(decVal, denomVal, appear = "enhance") {

    if (isNumeric(decVal)) {
        //condition string
        var nval = Number(decVal);
        var pval = denomVal;
        
        console.log("input val: " + nval);
        let cond = condition(nval, pval);
        nval = cond[0];
        console.log("solve val: " + nval);
        var rst = float_to_fraction(nval);
        var rsts = buildRstStr(rst[0], rst[1], rst[2], appear);

        return rsts;
    } else {
        // wont be able to process input 
        return decVal;
    }

    function isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    function condition(x, d) {
        n = Math.floor(x); // Get Integer value
        x = x - n; // Get fractional decimal value
        var v = [];
        for (let i = 0; i <= d; i++) {
            v[i] = (1 / d) * i;
        }
        let i = 0
        var error = 1 / d * 0.5;

        while (x > (v[i] - error) && x > (v[i] + error)) {
            i += 1;
        }

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
        //   - Add a console logging feature to trace progress.  The //console.log in the console.log function can be commented out to prevent 
        //     the console writes.  

        n = Math.floor(x);
        x = x - n;
        if (x < error) {
            return [n, 1, 1];
        } else if (1 - error < x) {
            return [n + 1, 1, 1];
        }
        // The lower fraction is 0 / 1
        lower_n = 0;
        lower_d = 1;
        // The upper fraction is 1 / 1
        upper_n = 1
        upper_d = 1

        var flg = true;
        let itr = 0;
        while (flg) {
            itr += 1;
            //# The middle fraction is(lower_n + upper_n) / (lower_d + upper_d)
            middle_n = lower_n + upper_n;
            middle_d = lower_d + upper_d;

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
            }
        }
        return [n, middle_n, middle_d];
    }

    function buildRstStr(w, n, d, appearance = "enhance") {
        var rstS = null;

        if ((n == 1 && d == 1) || n == 0) {
            rstS = w;
        } else {
            if (appearance.toLowerCase() == "enhance") {
                rstS = w + "-" + "<sup>" + n + "</sup>&frasl;<sub>" + d + "</sub>";
            } else {
                rstS = w + "-" + n + "/" + d;
            }
        }
        return rstS;
    }

}
