from flask import Flask, render_template, request, jsonify
app = Flask(__name__)
import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
from firebase import Firebase
import requests

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


cred = credentials.Certificate('./cert/firebase-service-account.json');
default_app = firebase_admin.initialize_app(cred, {"databaseURL": "https://chi-talk-default-rtdb.asia-southeast1.firebasedatabase.app/"})
Firebase(firebaseConfig)
auth = Firebase(firebaseConfig).auth()
@app.route('/')
def home():
    print(default_app.name)
    return render_template('index.html')

@app.route("/register")
def regitster():
    return render_template('loginpage.html')

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
    email = request.form['email']
    password = request.form['password']
    auth.create_user_with_email_and_password(email, password)
    birthday = request.form['birthday']
    phone = request.form['phone']
    id = auth.current_user.localId
    nickname = request.form['nickname']
    name = request.form['name']
    data = {
        'email':email,
        'Birthday':birthday,
        'Phone':phone,
        'Id':id,
        'Nickname':nickname,
        'Name':name
    }
    try:
        requests.post(
            url = 'https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user',
            json=data
        )
    except requests.exceptions.RequestException as erra:
        print("Error : ", erra)
        return erra
    
    return "work complete"

@app.route("/User", methods=["GET"])
async def get_user():
    id = auth.current_user
    user = requests.get(
        url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user',
        json={'Id':id}
    )
    return user

@app.route("/Map", methods=["POST"])
async def post_mapdata():
    Lng = request.form['Lng']
    Lat = request.form['Lat']
    Id = auth.current_user.localId
    return

if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)

