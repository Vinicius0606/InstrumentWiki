from flask import Flask, jsonify
from redis import Redis
from flask_cors import CORS
from dotenv import load_dotenv
from routes.auth_routes import auth_routes
from .db import init_db
import os

def create_app():

    load_dotenv()

    app = Flask(__name__)

    app.config["SECRET_KEY"]=os.getenv("SECRET_KEY")

    app.config["DEBUG"] = True

    app.register_blueprint(auth_routes)

    app.redis = Redis(host="localhost", port=6379, decode_responses=True)

    CORS(app,
        resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
        supports_credentials=True)

    init_db(app)

    return app