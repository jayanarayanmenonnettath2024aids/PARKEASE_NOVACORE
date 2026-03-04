import os
from flask import Blueprint, request, jsonify
from twilio.twiml.voice_response import VoiceResponse, Gather
from twilio.rest import Client
import logging

logger = logging.getLogger(__name__)
twilio_bp = Blueprint('twilio', __name__)

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_PHONE_NUMBER")
ngrok_url = os.getenv("NGROK_URL", "https://122a892411d472.lhr.life")

client = Client(account_sid, auth_token)

# ----------------------------------
# STEP 1: Ask Language
# ----------------------------------
@twilio_bp.route("/voice", methods=["POST"])
def voice():
    resp = VoiceResponse()

    gather = Gather(
        num_digits=1,
        action="/api/twilio/process-language",
        method="POST"
    )

    gather.say(
        "Welcome to ParkEase. "
        "For English press 1. "
        "தமிழுக்கு 2 அழுத்தவும்.",
        language="en-IN"
    )

    resp.append(gather)
    return str(resp)


# ----------------------------------
# STEP 2: Process Language
# ----------------------------------
@twilio_bp.route("/process-language", methods=["POST"])
def process_language():
    digit = request.values.get("Digits")
    resp = VoiceResponse()

    if digit == "1":
        language = "en"
    elif digit == "2":
        language = "ta"
    else:
        resp.say("Invalid selection.")
        return str(resp)

    gather = Gather(
        num_digits=1,
        action=f"/api/twilio/process-city?lang={language}",
        method="POST"
    )

    if language == "en":
        gather.say(
            "Select your city. "
            "For Coimbatore press 1. "
            "For Tirupur press 2. "
            "For Kondampatti press 3. "
            "For Kinathukadavu press 4. "
            "For Pollachi press 5. "
            "For Eachanari press 6.",
            language="en-IN"
        )
    else:
        gather.say(
            "நகரத்தை தேர்வு செய்யவும். "
            "கோயம்புத்தூருக்கு 1. "
            "திருப்பூருக்கு 2. "
            "கொண்டம்பட்டிக்கு 3. "
            "கிணத்துக்கடவுக்கு 4. "
            "பொள்ளாச்சிக்கு 5. "
            "ஈச்சனாரிக்கு 6.",
            language="ta-IN"
        )

    resp.append(gather)
    return str(resp)


# ----------------------------------
# STEP 3: Process City
# ----------------------------------
@twilio_bp.route("/process-city", methods=["POST"])
def process_city():
    digit = request.values.get("Digits")
    language = request.args.get("lang")
    user_number = request.values.get("To")

    resp = VoiceResponse()

    if digit != "1":
        if language == "en":
            voice_message = "Currently no parking available in this region. We only serve Coimbatore right now."
        else:
            voice_message = "இந்தப் பகுதியில் தற்போது பார்க்கிங் கிடைக்கவில்லை. நாங்கள் தற்போது கோயம்புத்தூர் மட்டுமே செயல்படுகிறோம்."
            
        resp.say(voice_message, language="en-IN" if language == "en" else "ta-IN")
        return str(resp)

    gather = Gather(
        num_digits=1,
        action=f"/api/twilio/process-area?lang={language}&city={digit}",
        method="POST"
    )

    if language == "en":
        gather.say(
            "Select area in Coimbatore. Press 1 for R. S. Puram. Press 2 for Gandhipuram. Press 3 for Town Hall.",
            language="en-IN"
        )
    else:
        gather.say(
            "கோயம்புத்தூரில் பகுதியை தேர்வு செய்யவும். "
            "ஆர்.எஸ். புரத்திற்கு 1. "
            "காந்திபுரத்திற்கு 2. "
            "டவுன் ஹாலுக்கு 3.",
            language="ta-IN"
        )

    resp.append(gather)
    return str(resp)


# ----------------------------------
# STEP 4: Process Area (Check DB Availability)
# ----------------------------------
@twilio_bp.route("/process-area", methods=["POST"])
def process_area():
    digit = request.values.get("Digits")
    language = request.args.get("lang")
    user_number = request.values.get("From")

    resp = VoiceResponse()
    
    lot_map = {
        "1": 1, 
        "2": 2, 
        "3": 3  
    }
    
    lot_id = lot_map.get(digit)

    if not lot_id:
        resp.say("Invalid area selected." if language == "en" else "தவறான பகுதி.", 
                 language="en-IN" if language == "en" else "ta-IN")
        return str(resp)
        
    from models import ParkingLot, ParkingSlot
    lot = ParkingLot.query.get(lot_id)
    
    if lot:
        available = ParkingSlot.query.filter_by(lot_id=lot.id, status='available').count()
        map_link = f"https://maps.google.com/?q={lot.latitude},{lot.longitude}"
        
        if available > 0:
            if language == "en":
                voice_message = f"Good news! There are {available} slots available at {lot.name}. We have sent you an SMS with navigation."
                sms_message = f"ParkEase Confirmation\n\nSlots available at {lot.name}!\nNavigation Link:\n{map_link}\n\n- Team ParkEase"
            else:
                voice_message = f"நல்ல செய்தி! {lot.name}-ல் {available} இடங்கள் உள்ளன. வழிசெலுத்தலுடன் உங்களுக்கு SMS அனுப்பியுள்ளோம்."
                sms_message = f"ParkEase உறுதிப்படுத்தல்\n\n{lot.name}-ல் பார்க்கிங் கிடைக்கிறது.\nNavigation Link:\n{map_link}\n\n- Team ParkEase"
        else:
            if language == "en":
                voice_message = f"Sorry, {lot.name} is currently fully occupied."
                sms_message = f"ParkEase\n\nSorry, no slots available at {lot.name} currently."
            else:
                voice_message = f"மன்னிக்கவும், {lot.name} தற்போது முழுமையாக நிரம்பியுள்ளது."
                sms_message = f"ParkEase\n\nமன்னிக்கவும், {lot.name}-ல் தற்போது இடமில்லை."
    else:
        voice_message = "System error locating that parking lot."
        sms_message = "ParkEase System Error."

    resp.say(voice_message, language="en-IN" if language == "en" else "ta-IN")

    try:
        if user_number:
            client.messages.create(
                body=sms_message,
                from_=twilio_number,
                to=user_number
            )
    except Exception as e:
        logger.error(f"Failed Twilio SMS: {e}")

    return str(resp)


# ----------------------------------
# Trigger Outbound Call
# ----------------------------------
@twilio_bp.route("/trigger-call")
def trigger_call():
    user_number = os.getenv("TEST_CALL_NUMBER")

    client.calls.create(
        to=user_number,
        from_=twilio_number,
        url=f"{ngrok_url}/api/twilio/voice"
    )

    return "Call triggered successfully!"
