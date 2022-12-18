let postid = ""
$(document).ready(function () {
    
    if(location.href.includes("?")){
        postid = location.href.split("?")[1].split("postid=")[1]
    }else{
        location.href = `/`;
        alert("표시할 글의 아이디가 지정되어있지 않습니다.\n카드에서 다시 클릭해보세요.\n홈으로 이동합니다.")
    }
    if(document.cookie.includes("id=")){
        login = true
        if(document.cookie.split("id=")[1].includes(";")){
            id = document.cookie.split("id=")[1].split(";")[0].replace(" ","")
        }else{
            id = document.cookie.split("id=")[1].replace(" ","")
        }
        let userinfo = ""
        $.ajax({
            url:"/User",
            method:"POST",
            data:{
                id:id
            },
            success: function(response){
                name = response.nickname
                            //목록 가져오기
                $.ajax({
                    url:"/Write",
                    method:"POST",
                    data:{
                        "Author":id
                    },
                    success: function(response){
                        response.forEach(element => {
                            let now = new Date()

                            let year = now.getFullYear()
                            let month = now.getMonth()
                            let day = now.getDate()
                            let hours = now.getHours()+9
                            let minutes = now.getMinutes()
                            let seconds = now.getSeconds()

                            let nowdate = new Date(year, month, day, hours, minutes, seconds)

                            let chai = nowdate.getTime() - new Date(element.Created_At).getTime()
                            let a = ""

                            let wmon = element.Created_At.split("-")[1]
                            let wday = element.Created_At.split("-")[2].split("T")[0]

                            if(chai < 1000 * 60)
                                a += '방금'
                            else if(chai < 1000 * 60 * 60)
                                a += Math.floor(chai / (1000 * 60)) + '분 전';
                            else if(chai < 1000 * 60 * 60 * 24)
                                a += Math.floor(chai / (1000 * 60 * 60)) + '시간 전';
                            else if(chai < 1000 * 60 * 60 * 24 * 30)
                                a += Math.floor(chai / (1000 * 60 * 60 * 24)) + '일 전';
                            else if(chai < 1000 * 60 * 60 * 24 * 30 * 12)
                                a += Math.floor(chai / (1000 * 60 * 60 * 24 * 30)) + '달 전';
                            else
                                a += Math.floor(chai / (1000 * 60 * 60 * 24 * 30 * 12)) + '년 전';
                            

                            if(postid == element.Created_At) {
                                addCard(element)
                            }
                        });
                    }
                })
            }
        })

    }else{
        if(location.href.includes("?")){
            loc = location.href.split("?")[1].split("postid=")[1]
            location.href = `/Login?loc = write/detail?postid=${loc}`
        }else{
            location.href = `/Login?loc = `;
        } 
        login = false
        alert("로그인이 필요합니다.")
    }
})

function addCard(element) {
    console.log(element)
    let wyear = element.Created_At.split("-")[0]
    let wmon = element.Created_At.split("-")[1]
    let wday = element.Created_At.split("-")[2].split("T")[0]

    let Date = wyear+"년 "+wmon+"월 "+wday+"일"
    let people_meet = ""
    let image = ""
    let card = ""
    if(element.People_meet == "None"){
        people_meet = "없음"
    }else{
        people_meet = element.People_meet
    }

    if(element.AttachFiles == "null" || element.AttachFiles == ""){
        card = Card(element.Name, element.AREA_ADR, people_meet, Date, element.Feel, element.Description, element.Eat)
    }else{
        image = element.AttachFiles
        card = CardI(element.Name, element.AREA_ADR, people_meet, image, Date, element.Feel, element.Description, element.Eat)
    }
    
    $('#main').prepend(card)
}

function Delete() {
    let created_At = location.href.split("?")[1].split("postid=")[1]
    $.ajax({
        url:'/Write',
        method:"DELETE",
        data:{
            'id':id,
            'Created_At':created_At
        },
        success: function(response) {
            location.href = "/"
            alert("글을 삭제했습니다.")
        }
    })
}

function CardI(name, adr, people_meet, image, date, feel, desc, Eat) {
        if(desc.length > 60){
            descleng = desc.length
            
        }
    return `<section id="section">
                <div class="detail_wrap">
                    <div class="detail_section">
                        <div class="detail_title">
                            <h1>${name}</h1>
                        </div>
                        <div class="picture">
                            <img src="${image}" alt="메뉴의 마이페이지 아이콘">
                        </div>
                        <div class="detail_content">
                            <div class="comment1">
                                <p>${date}</p>
                                <p>장소 : ${adr}</p>
                                <p>기분 : ${feel}</p>
                                <p>누구랑 : ${people_meet}</p>
                                <p>음식 : ${Eat}</p>
                            </div>
                            <div>
                                <div class="comment2">
                                    <p>
                                       ${desc}
                                    </p>
                                </div>
                            </div>
                            <div class="detail_bT">
                                <a href="/write/edit?postid=${postid}" ><input type="submit" class="submit" value="수정">
                                <a href="#" onclick="Delete()"><input type="reset" class="submit" value="삭제"></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>`
}
function Card(name, adr, people_meet,  date, feel, desc, Eat) {
    if(desc.length > 60){
        desc = desc.substring(0,61)+"\n"+desc.substring(62)
    }
return `<section id="section">
                <div class="detail_wrap">
                    <div class="detail_section">
                        <div class="detail_title">
                            <h1>${name}</h1>
                        </div>
                        <div class="picture">
                        </div>
                        <div class="detail_content">
                            <div class="comment1">
                                <p>${date}</p>
                                <p>장소 : ${adr}</p>
                                <p>기분 : ${feel}</p>
                                <p>누구랑 : ${people_meet}</p>
                                <p>음식 : ${Eat}</p>
                            </div>
                            <div>
                                <div class="comment2">
                                    <p>
                                       ${desc}
                                    </p>
                                </div>
                            </div>
                            <div class="detail_bT">
                                <a href="/write/edit?postid=${postid}"><input type="submit" class="submit" value="수정">
                                <a href="#" onclick="Delete()"><input type="reset" class="submit" value="삭제"></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>`
}