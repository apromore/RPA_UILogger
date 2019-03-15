
cd Excel_Addin
call npm install
cd ..
cd append_http
call npm install
cd ..


echo "Please provide your user ID:"

read userID

echo "Starting action logger with userID: $userID"


start npm start $userID --prefix append_http
call npm start --prefix Excel_Addin

