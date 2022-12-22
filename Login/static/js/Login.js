Kakao.init('4c43d4733daa8022e6465b441f59f10c')
function kakaAuth() {
  Kakao.Auth.login({
    success: function (response) {
      Kakao.API.request({
        url: '/v2/user/me',
        success: function (response) {
          let kkodata = response
          console.log(kkodata)
          $.ajax({
            type: 'POST',
            url: '/User/Login',
            data: { email: kkodata.kakao_account.email, password: kkodata.connected_at+"-"+kkodata.id },
            success: function (response) {
              if (response == "MISSING_EMAIL") {
                alert("이메일 허가가 필요합니다.")
                return
              }
              if (response == "INVALID_EMAIL") {
                alert("이메일 허가가 필요합니다.")
                return
              }

              if (response == "INVALID_PASSWORD") {
                alert("SNS 커넥션중 계정 최초 접속날짜 오류가 발생했습니다.\n채널톡으로 문의해주세요.")
                return
              }

              if (response == "MISSING_PASSWORD") {
                alert("SNS 커넥션중 최초 접속날짜 찾을수 없음 오류가 발생했습니다.\n채널톡으로 문의해주세요.")
                return
              }

              if (response == "EMAIL_NOT_FOUND") {
                let birthdayd = "2022-"+kkodata.kakao_account.birthday.substring(0,2)+"-"+kkodata.kakao_account.birthday.substring(2,4)
                $.ajax({
                  type: 'POST',
                  url: '/User/Register',
                  data: { email: kkodata.kakao_account.email, password: kkodata.connected_at+"-"+kkodata.id, phone: 'kakao', name: kkodata.kakao_account.profile.nickname, birthday: birthdayd, nickname: kkodata.kakao_account.profile.nickname },
                  success: function (response) {
                    if (response == "MISSING_EMAIL") {
                      alert("이메일을 입력해주세요.")
                    }
                    if (response == "EMAIL_EXISTS") {
                      alert("이미 사용중인 이메일 입니다.")
                    }
                    if (response == "INVALID_EMAIL") {
                      alert("입력하신 이메일을 확인해주세요.")
                    }

                    if (response == "MISSING_PASSWORD") {
                      alert("사용할 비밀번호를 입력해주세요.")
                    }

                    if (response == "TOO_MANY_DUPICATE") {
                      alert('비밀번호는 3자 이상 같은 문자를 사용할 수 없습니다.')
                    }

                    if (response == "PASSWORD_TOO_SHORT") {
                      alert('비밀번호 최소 6자리 이상 입력해주세요.')
                    }

                    if (response == "MISSING_PHONE") {
                      alert('전화번호를 입력해주세요.')
                    }

                    if (response == "MISSING_NICKNAME") {
                      alert('닉네임을 입력해주세요.')
                    }

                    if (response == "MISSING_NAME") {
                      alert('실명을 입력해주세요.')
                    }

                    if (response == "OK") {
                      alert('회원가입 성공!')
                      $.ajax({
                        type: 'POST',
                        url: '/User/Login',
                        data: { email: id, password: password },
                        success: function (response) {
                          if (response == "MISSING_EMAIL") {
                            alert("이메일을 입력해주세요.")
                            return
                          }
                          if (response == "INVALID_EMAIL") {
                            alert("입력하신 이메일을 확인해주세요.")
                            return
                          }
                    
                          if (response == "INVALID_PASSWORD") {
                            alert("비밀번호가 일치하지 않습니다.")
                            return
                          }
                    
                          if (response == "MISSING_PASSWORD") {
                            alert("비밀번호를 입력해주세요.")
                            return
                          }
                    
                          if (response == "EMAIL_NOT_FOUND") {
                            alert("해당 아이디를 찾을수 없습니다.\n아이디를 확인하고 다시 시도해주세요.")
                            return
                          }
                          document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                          document.cookie = "user_id = " + response
                          if (location.href.includes("?")) {
                            loc = location.href.split("?")[1].split("loc%20=%20")[1]
                            location.href = "/" + loc
                          } else {
                            location.href = `/`;
                          }
                        }
                      })
                    }
                  }
                });
              }

              document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
              document.cookie = "user_id = " + response
              if (location.href.includes("?")) {
                loc = location.href.split("?")[1].split("loc%20=%20")[1]
                location.href = "/" + loc
              } else {
                location.href = `/`;
              }
            }
          })
        },
        fail: function (error) {
          console.log(error)
        },
      })
    },
    fail: function (error) {
      console.log(error)
    },
  })
}

function Login() {
  let id = document.getElementById("emaill").value
  let password = document.getElementById("passwordd").value
  $.ajax({
    type: 'POST',
    url: '/User/Login',
    data: { email: id, password: password },
    success: function (response) {
      if (response == "MISSING_EMAIL") {
        alert("이메일을 입력해주세요.")
        return
      }
      if (response == "INVALID_EMAIL") {
        alert("입력하신 이메일을 확인해주세요.")
        return
      }

      if (response == "INVALID_PASSWORD") {
        alert("비밀번호가 일치하지 않습니다.")
        return
      }

      if (response == "MISSING_PASSWORD") {
        alert("비밀번호를 입력해주세요.")
        return
      }

      if (response == "EMAIL_NOT_FOUND") {
        alert("해당 아이디를 찾을수 없습니다.\n아이디를 확인하고 다시 시도해주세요.")
        return
      }
      document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      document.cookie = "user_id = " + response
      if (location.href.includes("?")) {
        loc = location.href.split("?")[1].split("loc%20=%20")[1]
        location.href = "/" + loc
      } else {
        location.href = `/`;
      }
    }
  })
}

function is_checked() {
  const checkbox = document.getElementById("flexCheckDefault");
  const is_checked = checkbox.checked;
  if (is_checked) {
    document.getElementById("passwordd").type = "text"
    document.getElementById("passwordd").autocomplete = "off"
  } else {
    document.getElementById("passwordd").type = "password"
    document.getElementById("passwordd").autocomplete = "current-password"
  }
}
