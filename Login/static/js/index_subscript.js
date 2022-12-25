let id = ""
$(document).ready(function () {
    if (location.href.includes("?")) {
        document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        location.href = "/"
    }
    if (document.cookie.includes("user_id")) {
        if (document.cookie.split("user_id=")[1].includes(";")) {
            id = document.cookie.split("user_id=")[1].split(";")[0].replace(" ", "")    
            console.log(id)
            getEatPercent(id)
            getPersonPercent(id)
            getPlacePercent(id)
            $(".top_icon").append(`<a href="/Mypage"><img src="../static/assets/mypage.png" alt="메뉴의 마이페이지 아이콘"></a>`)
            showall()
            $.ajax({
                type: "POST",
                url: "/User",
                data: { 'id': id },
                success: function (response) {
                    if(response.email == undefined){
                        alert("계정정보 로딩 실패 다시 로그인해주세요.")
                        document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                        location.href = "/"
                    }
                }
            })
        } else {
            
            id = document.cookie.split("user_id=")[1].replace(" ", "")
            console.log(id)
            getEatPercent(id)
            getPersonPercent(id)
            getPlacePercent(id)
            showall()
            $(".top_icon").append(`<a href="/Mypage"><img src="../static/assets/mypage.png" alt="메뉴의 마이페이지 아이콘"></a>`)
            $.ajax({
                type: "POST",
                url: "/User",
                data: { 'id': id },
                success: function (response) {
                    if(response.email == undefined){
                        alert("계정정보 로딩 실패 다시 로그인해주세요.")
                        document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                        location.href = "/"
                    }
                }
            })
        }
    } else {
        $(".top_icon").append(`<a href="/Login"><p>로그인</p></a>`)
    }
    $.ajax({
        url: "/Good_Say",
        method: "GET",
        success: function (response) {
            console.log(response)
            document.getElementById("good_say").innerHTML = response.message
            document.getElementById("good_say_author").innerHTML = `- ${response.author} -`
        }
    })

})

function getPlacePercent(id) {
    $.ajax({
        url: "/WriteA",
        method: "POST",
        data: {
            "Author": id
        },
        success: function (response) {
            const result = {};
            response.forEach(element => {
                adr = element.AREA_ADR
                result[adr] = (result[adr] || 0) + 1;
            })


            let per = []
            let resmap = new Map(Object.entries(result))
            const mapSort1 = new Map([...resmap.entries()].sort((a, b) => a[1] - b[1]));
            let max = 0

            mapSort1.forEach(element => {
                max += element
            })

            mapSort1.forEach(element => {
                percent = element / max * 100
                per.push(percent.toFixed(2))
            })

            let keyarr = Array.from(mapSort1.keys())
            let permap = []
            for (var i = 0; i < keyarr.length; i++) {
                permap.push({ 'name': keyarr[i], 'per': per[i] })
            }


            console.log(permap[0])
        }
    })
}

function getEatPercent(id) {
    $.ajax({
        url: "/WriteA",
        method: "POST",
        data: {
            "Author": id
        },
        success: function (response) {
            const result = {};
            response.forEach(element => {
                adr = element.Eat
                result[adr] = (result[adr] || 0) + 1;
            })


            let per = []
            let resmap = new Map(Object.entries(result))
            const mapSort1 = new Map([...resmap.entries()].sort((a, b) => a[1] - b[1]));
            let max = 0

            mapSort1.forEach(element => {
                max += element
            })

            mapSort1.forEach(element => {
                percent = element / max * 100
                per.push(percent.toFixed(2))
            })

            let keyarr = Array.from(mapSort1.keys())
            let permap = []
            for (var i = 0; i < keyarr.length; i++) {
                permap.push({ 'name': keyarr[i], 'per': per[i] })
            }

            let eat = permap[0].name
            //한식, 일식, 중식, 양식
            $('#food_no_choose').text(`${eat}을 안 먹은지 오래되셨더라고요 ( ˘･_･˘ )`)
            if (eat == "한식") {
                hansik()
            }
            if (eat == "일식") {
                jpnsik()
            }
            if (eat == "중식") {
                chnsik()
            }
            if (eat == "양식") {
                amesik()
            }

        }
    });
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hansik() {
    $("#food_image").empty()
    let imagelist = ["../static/assets/menu/korean/bibimbap.png", "../static/assets/menu/korean/ramyeon.png", "../static/assets/menu/korean/salad.png", "../static/assets/menu/korean/tteokbokki.png"]
    let image = imagelist[rand(0, 3)]
    $("#food_image").append(`<img src=${image} alt="한식">`)
}

function jpnsik() {
    $("#food_image").empty()
    let imagelist = ["../static/assets/menu/japan/eelrice.png", "../static/assets/menu/japan/sushi.png", "../static/assets/menu/japan/takoyaki.png"]
    let image = imagelist[rand(0, 2)]
    $("#food_image").append(`<img src=${image} alt="일식">`)
}

function chnsik() {
    $("#food_image").empty()
    let imagelist = ["../static/assets/menu/china/dandan.png", "../static/assets/menu/china/Dimsum.png", "../static/assets/menu/china/mutton.png"]
    let image = imagelist[rand(0, 2)]
    $("#food_image").append(`<img src=${image} alt="중식">`)
}

function amesik() {
    $("#food_image").empty()
    let imagelist = ["../static/assets/menu/american/Hamburger.png", "../static/assets/menu/american/steak.png"]
    let image = imagelist[rand(0, 1)]
    $("#food_image").append(`<img src=${image} alt="양식">`)
}

function getPersonPercent(id) {
    $.ajax({
        url: "/WriteA",
        method: "POST",
        data: {
            "Author": id
        },
        success: function (response) {
            console.log(response)
            const result = {};
            response.forEach(element => {
                peo = element.People_meet

                if (peo.includes(",")) {
                    peo.split(",").forEach(ele => {
                        result[ele] = (result[ele] || 0) + 1;
                    })
                } else {
                    if (peo != "None") {
                        result[peo] = (result[peo] || 0) + 1;
                    }
                }

            })


            let per = []
            let resmap = new Map(Object.entries(result))
            const mapSort1 = new Map([...resmap.entries()].sort((a, b) => a[1] - b[1]));
            let max = 0

            mapSort1.forEach(element => {
                max += element
            })

            mapSort1.forEach(element => {
                percent = element / max * 100
                per.push(percent.toFixed(2))
            })

            let keyarr = Array.from(mapSort1.keys())
            let permap = []
            for (var i = 0; i < keyarr.length; i++) {
                permap.push({ 'name': keyarr[i], 'per': per[i] })
            }


            $("#peoname").text(permap[0].name)




        }
    })
}

function showall(filter) {
    $.ajax({
        url: "/WriteA",
        method: "POST",
        data: {
            "Author": id
        },
        success: function (response) {
            console.log(response)
            const result = {};
            let element = response[rand(0, response.length - 1)]
            console.log(element)
            let Feel = element.Feel
            let LAT = element.AREA_LAT
            let LNG = element.AREA_LNG
            let ADR = ""
            if (element.AREA_LOAD_ADR != "null") {
                ADR = element.AREA_LOAD_ADR
            } else {
                ADR = element.AREA_ADR
            }
            let Name = ""
            if (element.AREA_CUSTOM_NAME != "null") {
                Name = element.AREA_CUSTOM_NAME
            } else {
                if (element.AREA_NAME != "null") {
                    Name = element.AREA_NAME
                } else {
                    Name = ""
                }
            }

            let Created_At = element.Created_At.split("T")[0].split("-")[0] + "-" + element.Created_At.split("T")[0].split("-")[1] + "-" + element.Created_At.split("T")[0].split("-")[2] + " " + element.Created_At.split("T")[1].split(".")[0]
            customMarker(Feel, LAT, LNG, ADR, Name, Created_At, element.Created_At)
        }
    })
}
