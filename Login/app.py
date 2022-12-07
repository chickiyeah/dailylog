
import cgi
import html

import django
from django.utils.html import escape
try:
    from html import unescape
except ImportError:
        from html.parser import HTMLParser

import random
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
    return render_template('Login.html')

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
    try:
        auth.sign_in_with_email_and_password(email, password)
    except requests.exceptions.HTTPError as erra:
        #HTTP 에러가 발생한 경우
        #오류 가져오기 json.loads(str(erra).split("]")[1].split('"errors": [\n')[1])['message']
        return json.loads(str(erra).split("]")[1].split('"errors": [\n')[1])['message']

    currentuser = auth.current_user
    user = requests.get(
        url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user',
        json={'Id':currentuser['localId']}
    )
    user.encoding = "UTF-8"
    return json.loads(user.text)['id']

@app.route("/write/detail")
async def record():
    return render_template("revisepage.html")

@app.route("/Mypage")
async def mypage():
    return render_template("profile.html")

@app.route("/Mypage/Write")
async def myWrite():
    return render_template("mywrite.html")

@app.route("/Mypage/Like")
async def Like():
    return render_template("mylike.html")

@app.route("/Mypage/Delete")
async def Delete():
    return render_template("sessionout.html")

@app.route("/Login/find_account")
async def find_account():
    return render_template("idpw.html")

@app.route("/rank")
async def rank():
    return render_template("ranking.html")

@app.route("/Good_Say", methods=["GET"])
async def good_say():
    id = random.randrange(0,592)
    user = requests.get(
        url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/good_say',
        json={'number':id}
    )
    user.encoding = "UTF-8"
    return json.loads(user.text)


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

@app.route("/User", methods=["POST"])
async def get_user():
    id = request.form['id']
    user = requests.get(
        url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user',
        json={'Id':id}
    )
    user.encoding = "UTF-8"
    return json.loads(user.text)

@app.route("/User/FindID", methods=["GET"])
async def FindID():
    name = request.form['name']
    phone = request.form['phone']
    birthday = request.form['birthday']

    json = {
        'name' : name,
        'phone' : phone,
        'birthday' : birthday
    }

    ID = requests.get(
        url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user/findid',
        json=json
    )
    ID.encoding = "UTF-8"
    return json.loads(ID.text)

@app.route("/write/1")
def write():
    return render_template("write.html")

@app.route("/write/2")
def write2():
    return render_template("write2.html")

@app.route("/edit")
async def edit():
    return render_template("write2(update).html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/write/upload", methods=["POST"])
def writeupload():
    now = datetime.now()
    Author = request.form['Author']
    Name = request.form['Name']
    Desc = request.form['Desc']
    People_meet = request.form['People_meet']
    Feel = request.form['Feel']
    Eat = request.form['Eat']
    AttachFiles = request.form['AttachFiles[]']
    Area = request.form['Area']
    

    json = {
        'Author':Author,
        'Name':Name,
        'Description':escape(Desc),
        'People_meet':People_meet,
        'Feel':Feel,
        'Eat':Eat,
        'AttachFiles':AttachFiles,
        'Area':Area,
        'Created_At':str(now)
    }

    print(json)

    try:
        res = requests.post(
            url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/write',
            json=json
        )._content
    except requests.exceptions.RequestException as error:
        print(error)
        return error

    print(res)

    if(str(res).split("\"")[1].split("\"")[0] == "Status Code : 200 | OK : Successfully added data "):
        return "OK"

    return res['errorMessage']
####여기부터
@app.route("/record",methods=["POST"])
async def record2():
    now = datetime.now()
    Date = request.form['Date']
    Author = request.form['Author']
    Name = request.form['Name']
    Desc = request.form['Desc']
    AttachFiles = request.form['AttachFiles']
   

    json = {
        'Author':Author,
        'Name':Name,
        'Desc':Desc,
        'Date':Date,
        'AttachFiles':AttachFiles,
      
        'Created_At':str(now)
    }

    try:
        res = requests.post(
            url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/write',
            json=json
        )
    except requests.exceptions.RequestException as error:
        return error


    return render_template("record.html")
    
    return "record complete"







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
