const scriptURL = "https://script.google.com/macros/s/AKfycbxQNyXXfSFcAm7p2NOjLiJWRcGmn0KqRhy1ytFBU5kUJERTMo6gP2QMRIEAa_DMqUp7/exec";
const form = document.getElementById("fm");

const allowedBranches = {
  chennai: "Chennai",
  madurai: "Madurai",
  trichy: "Trichy",
  pudukkottai: "Pudukkottai"
};

// Read branch from URL; default to General
const params = new URLSearchParams(window.location.search);
const branchParam = (params.get("branch") || "general")
  .trim()
  .toLowerCase();

const branch = allowedBranches[branchParam] || "General";

// Store the branch in the hidden HTML field if it exists
const branchInput = document.getElementById("branch");
if (branchInput) {
  branchInput.value = branch;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const patientName = document.getElementById("nm").value.trim();
  const patientPhone = document.getElementById("ph").value.trim();
  const patientGender =
    document.querySelector('input[name="g"]:checked')?.value || "";
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
  formData.append("branch", branch);

  fetch(scriptURL, {
    method: "POST",
    body: formData
  })
    .then(() => {
      // Keep your existing success handling here.
    })
    .catch(error => {
      console.error("Submission error:", error);
      alert("Could not send the request.");
    });
});