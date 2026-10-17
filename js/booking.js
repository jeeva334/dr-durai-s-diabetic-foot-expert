const scriptURL = "https://script.google.com/macros/s/AKfycbxcLgGNWQX6lvQLs0CshmF5JzE6C07gPoT6uF6bGi6t9UVbrUEJ2DAojUSszFU0lSHS/exec";

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

  // console.log("Submitting booking:", {
  //   name: patientName,
  //   phone: patientPhone,
  //   gender: patientGender,
  //   mode: consultationMode,
  //   branch: branch
  // });

  
  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: formData
    });

    const result = await response.text();

    console.log("Apps Script response:", result);

    if (!response.ok || result.trim() !== "Saved") {
      throw new Error(
        "Appointment submission failed: " + result
      );
    }
    form.reset();
    console.log("Appointment saved successfully.");

    // Show your existing success popup here.

  } catch (error) {
    console.error("Submission error:", error);

    // Replace this with your existing form error UI if available.
    const errorMessage = document.getElementById("errorMessage");

    if (errorMessage) {
      errorMessage.textContent =
        "Unable to submit your appointment. Please try again.";
      errorMessage.hidden = false;
    }
  }

});
