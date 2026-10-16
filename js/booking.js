const scriptURL = "https://script.google.com/macros/s/AKfycbxQNyXXfSFcAm7p2NOjLiJWRcGmn0KqRhy1ytFBU5kUJERTMo6gP2QMRIEAa_DMqUp7/exec";
const form = document.getElementById("fm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const patientName = document.getElementById("nm").value.trim();
  const patientPhone = document.getElementById("ph").value.trim();
  const patientGender = document.querySelector('input[name="g"]:checked')?.value || "";
  const consultationMode = document.getElementById("md").value;

  // Check consent
  if (!document.getElementById("cn").checked) {
    alert("Please accept the consent.");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("name", patientName);
  formData.append("phone", patientPhone);
  formData.append("gender", patientGender);
  formData.append("mode", consultationMode);

  console.log("Sending form data:", formData.toString());

  fetch(scriptURL , {
  method: "POST",
  body: formData
})
  .then(() => {
    alert("Request sent. Check your Google Sheet.");
  })
  .catch(error => {
    console.error("Submission error:", error);
    alert("Could not send the request.");
  });
});