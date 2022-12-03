
import string
from flask import Flask, render_template, request, jsonify
app = Flask(__name__)
import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
from firebase_admin import storage
from firebase import Firebase
import requests
import json
import re
from datetime import datetime

firebaseConfig = {
    "apiKey": "AIzaSyCVb40j3gvwMG2vVbBPgTNgAY1E-c6aq2c",
    "authDomain": "chi-talk.firebaseapp.com",
    "projectId": "chi-talk",
    "storageBucket": "chi-talk.appspot.com",
    "databaseURL": "https://chi-talk-default-rtdb.asia-southeast1.firebasedatabase.app/",
    "messagingSenderId": "610565215401",
    "appId": "1:610565215401:web:2f6b876047977af0b705b8",
    "measurementId": "G-W2MBLH5D13"
  };

#서버 현재 시간
now = datetime.now()

#파이어베이스 서비스 세팅
cred = credentials.Certificate('./cert/firebase-service-account.json')
default_app = firebase_admin.initialize_app(cred, {"databaseURL": "https://chi-talk-default-rtdb.asia-southeast1.firebasedatabase.app/"})

auth = Firebase(firebaseConfig).auth()
Storage = Firebase(firebaseConfig).storage()

#네비게이터
@app.route('/')
def home():
    print(default_app.name)
    return render_template('index.html')

@app.route("/Login")
def Login():
    return render_template('loginpage.html')

@app.route("/register")
def Register():
    return render_template('register.html')

@app.route("/Loginform")
def loginpage():
    return render_template('Login.html')

#유저 로그인 회원가입
@app.route("/User/Login", methods=["POST"])
async def user_login():
    email = request.form['email']
    password = request.form['password']
    auth.sign_in_with_email_and_password(email, password)
    currentuser = auth.current_user
    return currentuser

@app.route("/User/Register", methods=["POST"])
async def user_create():
    now = datetime.now()
    email = request.form['email']
    password = request.form['password']
    birthday = request.form['birthday']
    phone = request.form['phone']
    nickname = request.form['nickname']
    name = request.form['name']
    #이메일이 공란이면
    if(len(email) == 0):
        print(len(email))
        return "MISSING_EMAIL"

    #비번이 공란이면
    if(len(password) == 0):
        return "MISSING_PASSWORD"
    else:
        #비번이 6자리 이하이면
        if(len(password) <= 6):
            return "PASSWORD_TOO_SHORT"
        else:
            #비번에 4글자이상 중복되는 글자가 있으면
            if(re.search('(([a-zA-Z0-9])\\2{3,})', password)):
                return "TOO_MANY_DUPICATE"

    #번호가 공란이면
    if(len(phone) == 0):
        return "MISSING_PHONE"
    else:
        phone = phone.replace(" " , "").replace("-","")

    #닉네임이 공란이면
    if(len(nickname) == 0):
        return "MISSING_NICKNAME"

    #실명이 공란이면
    if(len(name) == 0):
        return "MISSING_NAME"


    try:
        #파이어베이스의 유저만드는거 사용
        a = auth.create_user_with_email_and_password(email, password)
    except requests.exceptions.HTTPError as erra:
        #HTTP 에러가 발생한 경우
        #오류 가져오기 json.loads(str(erra).split("]")[1].split('"errors": [\n')[1])['message']
        return json.loads(str(erra).split("]")[1].split('"errors": [\n')[1])['message']

    #유저의 고유 아이디 (UniqueID)
    id = a['localId']
    data = {
        'email':email,
        'Birthday':birthday,
        'Phone':phone,
        'Id':id,
        'Nickname':nickname,
        'Name':name,
        'Created_At':str(now),
        'Last_Login_At':str(now)
    }
    try:
        c = requests.post(
            url = 'https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user',
            json=data
        )._content
    except requests.exceptions.RequestException as erra:
        print( erra)
        return erra
    

    if(str(c).split("\"")[1].split("\"")[0] == "Status Code : 200 | OK : Successfully added data "):
        return "OK"

    return c['errorMessage']

@app.route("/User", methods=["GET"])
async def get_user():
    id = auth.current_user
    user = requests.get(
        url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user',
        json={'Id':id}
    )
    return user

@app.route("/write/1")
def write():
    return render_template("write.html")

@app.route("/write/2")
def write2():
    return render_template("write2.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/UploadFile", methods=["POST"])
def upload():
    File = request.files['File']
    #print(File)
    a = Storage.child("/daily-log/"+str(now)).put(File)
    #print(a)
    #print("https://firebasestorage.googleapis.com/v0/b/chi-talk.appspot.com/o/daily-log%2F"+str(now)+"?alt=media&token="+a['downloadTokens'])
    return "https://firebasestorage.googleapis.com/v0/b/chi-talk.appspot.com/o/daily-log%2F"+str(now)+"?alt=media&token="+a['downloadTokens']

@app.route("/Map", methods=["POST"])
async def post_mapdata():
    Lng = request.form['Lng']
    Lat = request.form['Lat']
    Adr = request.form['Adr']
    Id = auth.current_user.localId
    Name = request.form['Name']
    Desc = request.form['Desc']

    json = {
        'Lng' : Lng,
        'Lat' : Lat,
        'Adr':Adr,
        'Name': Name,
        'Desc':Desc,
        'Created_At':now,
        'Last_Login_At':now
    }
    try:
        res = requests.post(
            url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/Map',
            json=json
        )
    except requests.exceptions.RequestException as error:
        return error

    return

####여기부터 작성
@app.route("/Map", methods=["GET"])
async def get_mapdata():

    json = {}
    try:
        res = request.get(
                url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user',
                json=json
            )
    except requests.exceptions.RequestException as error:
        return error

    return
    

if __name__ == '__main__':
   app.run('0.0.0.0', port=80, debug=True)
