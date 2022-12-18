$(document).ready(function() {     

    let top = document.querySelector("#map_warp").offsetTop
    let left = document.querySelector("#map_warp").offsetLeft

    $(".hAddr").css({
        "top":top/10,
        "left":left
    })   
    // Geolocation API에 액세스할 수 있는지를 확인
    if (navigator.geolocation) {
        //위치 정보를 얻기
        navigator.geolocation.getCurrentPosition (function(pos) {
            console.log(pos.coords.latitude);     // 위도
            console.log(pos.coords.longitude); // 경도
        },
        function(err){
            console.log(err)
        });
    } else {
        alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.")
    }
});