const scriptURL = "https://script.google.com/macros/s/AKfycbxQNyXXfSFcAm7p2NOjLiJWRcGmn0KqRhy1ytFBU5kUJERTMo6gP2QMRIEAa_DMqUp7/exec";

const formData = new URLSearchParams();

formData.append("name", patientName);
formData.append("phone", patientPhone);
formData.append("gender", patientGender);
formData.append("mode", consultationMode);

fetch(scriptURL, {
  method: "POST",
  mode: "no-cors",
  body: formData
});