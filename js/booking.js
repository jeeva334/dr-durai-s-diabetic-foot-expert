const scriptURL = "https://script.google.com/macros/s/AKfycbxQNyXXfSFcAm7p2NOjLiJWRcGmn0KqRhy1ytFBU5kUJERTMo6gP2QMRIEAa_DMqUp7/exec";

const form = document.getElementById("fm");

const allowedBranches = {
  chennai: "Chennai",
  madurai: "Madurai",
  trichy: "Trichy",
  pudukkottai: "Pudukkottai"
};

function getBranch() {
  const params = new URLSearchParams(window.location.search);
  const branchKey = (params.get("branch") || "general")
    .trim()
    .toLowerCase();

  return allowedBranches[branchKey] || "General";
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const patientName = document.getElementById("nm").value.trim();
  const patientPhone = document.getElementById("ph").value.trim();
  const patientGender =
    document.querySelector('input[name="g"]:checked')?.value || "";
  const consultationMode = document.getElementById("md").value;
  const branch = getBranch();

  if (!document.getElementById("cn").checked) {
    alert("Please accept the consent.");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("name", patientName);
  formData.append("phone", patientPhone);
  formData.append("gender", patientGender);
  formData.append("mode", consultationMode);
  formData.append("branch", branch);

  console.log("Submitting booking:", {
    name: patientName,
    phone: patientPhone,
    gender: patientGender,
    mode: consultationMode,
    branch: branch
  });

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: formData
    });

    console.log("Apps Script response:", await response.text());
    alert("Booking request submitted. Please verify the Google Sheet.");
  } catch (error) {
    console.error("Submission error:", error);
    alert("Could not confirm submission. Please check the Google Sheet before trying again.");
  }
});
