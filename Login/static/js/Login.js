function Login() {
    let id = document.getElementById("emaill").value
    let password = document.getElementById("passwordd").value
    $.ajax({
      type: 'POST',
      url: '/User/Login',
      data: {email: id, password:password},
      success: function (response) {
        if(response == "MISSING_EMAIL"){
                alert("이메일을 입력해주세요.")
                return
            }  
              if(response == "INVALID_EMAIL"){
                alert("입력하신 이메일을 확인해주세요.")
                return
              }

              if(response == "INVALID_PASSWORD"){
                alert("비밀번호가 일치하지 않습니다.")
                return
              } 

              if(response == "MISSING_PASSWORD"){
                alert("비밀번호를 입력해주세요.")
                return
              }
        document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        document.cookie = "user_id = "+response
        if(location.href.includes("?")){
            loc = location.href.split("?")[1].split("loc%20=%20")[1]
            location.href = "/"+loc
        }else{
            location.href = `/`;
        }
      }
    })
}

function is_checked() {
    const checkbox = document.getElementById("flexCheckDefault");
    const is_checked = checkbox.checked;
    if(is_checked){
        document.getElementById("passwordd").type = "text"
        document.getElementById("passwordd").autocomplete = "off"
    }else{
        document.getElementById("passwordd").type = "password"
        document.getElementById("passwordd").autocomplete = "current-password"
    }
}