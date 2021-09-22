function hitit(bullet){
    var showit_ele = document.getElementById("showit");

    showit_ele.value = bullet;

    showitupper(bullet,showit_ele);
    
    function showitupper(bullet, ele) {
        ele.value = bullet.toUpperCase();
    }
}