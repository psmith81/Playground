
function intake(val){
    console.log("inside intake");
    var FracVal_ele = document.getElementById("FracVal");
    var RstFmt_ele = document.getElementById("RstFmt");
    var result_elm = document.getElementById("Results");

    var FracVal = FracVal_ele.value;
    var rstFmt = RstFmt_ele.checked;
    var appear = "standard";

    if (rstFmt){
        appear = "enhance";
    }

    //var startTime = performance.now();
    var rst = decToFraction(val,FracVal,appear);
    //var endTime = performance.now();

    result_elm.innerHTML = rst;

    //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
}