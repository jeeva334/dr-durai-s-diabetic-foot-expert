const scriptURL = "https://script.google.com/macros/s/AKfycbxQNyXXfSFcAm7p2NOjLiJWRcGmn0KqRhy1ytFBU5kUJERTMo6gP2QMRIEAa_DMqUp7/exec";

const form = document.getElementById("fm");

form.addEventListener("submit", async function (event) {
  event.preventDefault();
alert("Submit button is working!");
  // Read the existing form fields
  const patientName = document.getElementById("nm").value.trim();
  const patientPhone = document.getElementById("ph").value.trim();
  const patientGender = document.querySelector('input[name="g"]:checked').value;
  const consultationMode = document.getElementById("md").value;

  const consent = document.getElementById("cn").checked;

  if (!consent) {
    alert("Please provide consent before submitting.");
    return;
  }

  const formData = new URLSearchParams();

  formData.append("name", patientName);
  formData.append("phone", patientPhone);
  formData.append("gender", patientGender);
  formData.append("mode", consultationMode);

  try {
    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    // Keep your existing success message here
  } catch (error) {
    console.error("Submission error:", error);
    alert("முன்பதிவு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
  }
  
});