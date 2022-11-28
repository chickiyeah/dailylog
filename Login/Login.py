from flask import Flask, render_template, request, jsonify
app = Flask(__name__)
import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
from firebase import Firebase

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
    return render_template('Login.html')

@app.route("/Login", methods=["POST"])
async def user_post():
    email = request.form['email']
    password = request.form['password']
    auth.sign_in_with_email_and_password(email, password)
    currentuser = auth.current_user
    return currentuser

if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)

