
$(document).ready(function () {
  if (location.href.includes("?")) {
    if (location.href.includes("state")) {
      //네이버
      if (location.href.split("state=")[1] == "Naver") {
        if (location.href.includes("code=")) {
          let code = location.href.split("code=")[1].split("&")[0]
          console.log(code)
          $.ajax({
            url: "/Login/Navertoken",
            method: "POST",
            data: {
              'code': code
            },
            success: function (response) {
              let naverdata = response.response
              $.ajax({
                type: 'POST',
                url: '/User/Login',
                data: { email: "naver_"+naverdata.email, password: naverdata.id },
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
                    $.ajax({
                      type: 'POST',
                      url: '/User/Register',
                      data: { email: "naver_"+naverdata.email, password: naverdata.id, phone: naverdata.mobile, name: naverdata.name, birthday: naverdata.birthyear+"-"+naverdata.birthday, nickname: naverdata.nickname },
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
                          $.ajax({
                            type: 'POST',
                            url: '/User/Login',
                            data: { email: "naver_"+naverdata.email, password: naverdata.id },
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

                              $.ajax({
                                type: "POST",
                                url: "/User",
                                data: { 'id': id },
                                success: function (response) {
                                  if (response.email == undefined) {
                                    alert("계정정보 로딩 실패 다시 로그인해주세요.")
                                    document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                                    location.href = "/Login"
                                  } else {
                                    document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                                    document.cookie = "user_id = " + response
                                    if (location.href.includes("?") && location.href.includes("loc%20=%20")) {
                                      loc = location.href.split("?")[1].split("loc%20=%20")[1]
                                      location.href = "/" + loc
                                    } else {
                                      location.href = `/`;
                                    }
                                  }
                                }
                              })

                            }
                          })
                        }
                      }
                    });
                  }

                  document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                  document.cookie = "user_id = " + response
                  if (location.href.includes("?") && location.href.includes("loc%20=%20")) {
                    loc = location.href.split("?")[1].split("loc%20=%20")[1]
                    location.href = "/" + loc
                  } else {
                    location.href = `/`;
                  }
                }
              })
            },
            fail: function (err) {
              console.log(err)
            }
          })
        } else {
          let errmessage = location.href.split("error_description=")[1]
          alert(errmessage)
        }
      }
    }
  }
})


function NaverLogin() {
  var oauth2Endpoint = 'https://nid.naver.com/oauth2.0/authorize';

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {
    'client_id': 'rmzcetOz2YMjocxnYhPh',
    'redirect_uri': 'https://daily-log.co.kr/Login',
    'response_type': 'code',
    'state': 'Naver'
  };

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}

function handleCredentialResponse(response) {
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  const responsePayload = parseJwt(response.credential);

  let goid = responsePayload.sub;
  let goname = responsePayload.name;

  let email = responsePayload.email
  let gpassword0 = "!" + responsePayload.sub.substring(2, 5) + "$" + responsePayload.sub.substring(10, 13) + "@&dfhjsdalajsj%^%%$&243" + responsePayload.sub.substring(15, 19) + "&$#&@!*332" + responsePayload.sub.substring(19)

  $.ajax({
    type: 'POST',
    url: '/User/Login',
    data: { email: "google_"+email, password: gpassword0 },
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
        $.ajax({
          type: 'POST',
          url: '/User/Register',
          data: { email: "google_"+email, password: gpassword0, phone: 'google', name: goname, birthday: "2022-12-24", nickname: goname },
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
              $.ajax({
                type: 'POST',
                url: '/User/Login',
                data: { email: "google_"+email, password: gpassword0 },
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

                  $.ajax({
                    type: "POST",
                    url: "/User",
                    data: { 'id': id },
                    success: function (response) {
                      if (response.email == undefined) {
                        alert("계정정보 로딩 실패 다시 로그인해주세요.")
                        document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                        location.href = "/Login"
                      } else {
                        document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                        document.cookie = "user_id = " + response
                        if (location.href.includes("?")) {
                          loc = location.href.split("?")[1].split("loc%20=%20")[1]
                          location.href = "/" + loc
                        } else {
                          location.href = `/`;
                        }
                      }
                    }
                  })

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
};

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

//처음 실행하는 함수
function init() {
  gapi.load('auth2', function () {
    gapi.auth2.init();
    options = new gapi.auth2.SigninOptionsBuilder();
    options.setPrompt('select_account');
    // 추가는 Oauth 승인 권한 추가 후 띄어쓰기 기준으로 추가
    options.setScope('email profile openid https://www.googleapis.com/auth/user.birthday.read');
    // 인스턴스의 함수 호출 - element에 로그인 기능 추가
    // GgCustomLogin은 li태그안에 있는 ID, 위에 설정한 options와 아래 성공,실패시 실행하는 함수들
    gapi.auth2.getAuthInstance().attachClickHandler('GgCustomLogin', options, onSignIn, onSignInFailure);
  })
}

function onSignIn(googleUser) {
  console.log(googleUser)
  var access_token = googleUser.getAuthResponse().access_token
  $.ajax({
    // people api를 이용하여 프로필 및 생년월일에 대한 선택동의후 가져온다.
    url: 'https://people.googleapis.com/v1/people/me'
    // key에 자신의 API 키를 넣습니다.
    , data: { personFields: 'birthdays', key: 'AIzaSyBhQ_PmHPQs8RVcl-fiiZ586KgSJhCdyao', 'access_token': access_token }
    , method: 'GET'
  })
    .done(function (e) {
      //프로필을 가져온다.
      var profile = googleUser.getBasicProfile();
      console.log(profile)
    })
    .fail(function (e) {
      console.log(e);
    })
}
function onSignInFailure(t) {
  console.log(t);
}

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
            data: { email: kkodata.kakao_account.email, password: kkodata.connected_at + "-" + kkodata.id },
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
                alert("이메일계정으로 가입된 이메일입니다.")
                return
              }

              if (response == "EMAIL_NOT_FOUND") {
                let birthdayd = "2022-" + kkodata.kakao_account.birthday.substring(0, 2) + "-" + kkodata.kakao_account.birthday.substring(2, 4)
                $.ajax({
                  type: 'POST',
                  url: '/User/Register',
                  data: { email: kkodata.kakao_account.email, password: kkodata.connected_at + "-" + kkodata.id, phone: 'kakao', name: kkodata.kakao_account.profile.nickname, birthday: birthdayd, nickname: kkodata.kakao_account.profile.nickname },
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

                          $.ajax({
                            type: "POST",
                            url: "/User",
                            data: { 'id': id },
                            success: function (response) {
                              if (response.email == undefined) {
                                alert("계정정보 로딩 실패 다시 로그인해주세요.")
                                document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                                location.href = "/Login"
                              } else {
                                document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                                document.cookie = "user_id = " + response
                                if (location.href.includes("?")) {
                                  loc = location.href.split("?")[1].split("loc%20=%20")[1]
                                  location.href = "/" + loc
                                } else {
                                  location.href = `/`;
                                }
                              }
                            }
                          })

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
      $.ajax({
        type: "POST",
        url: "/User",
        data: { 'id': response },
        success: function (response) {
          console.log(response)
          if (response.email == undefined) {
            alert("계정정보 로딩 실패 다시 로그인해주세요.")
            document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
            //location.href = "/Login"
          } else {
            document.cookie = "user_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
            document.cookie = "user_id = " + response.id
            if (location.href.includes("?")) {
              loc = location.href.split("?")[1].split("loc%20=%20")[1]
              location.href = "/" + loc
            } else {
              location.href = `/`;
            }
          }
        }
      })
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
