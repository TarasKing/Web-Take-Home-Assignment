// Select elements
const originalForm = document.getElementById(
  "hbspt-form-1725840071000-5193910479"
);
const formContainer = document.querySelector(".contact-form__form.kam-world");

const submitButtonContainer = document.getElementsByClassName("actions")[0];
const submitButton = document.getElementsByClassName(
  "hs-button primary large"
)[0];
const firstNameField = document.getElementsByClassName(
  "hs_firstname hs-firstname hs-fieldtype-text field hs-form-field"
)[0];
const lastNameField = document.getElementsByClassName(
  "hs_lastname hs-lastname hs-fieldtype-text field hs-form-field"
)[0];
const emailField = document.getElementsByClassName(
  "hs_email hs-email hs-fieldtype-text field hs-form-field"
)[0];
const howCanWeHelpYouField = document.getElementsByClassName(
  "hs_how_can_we_help_you___contact_us_form_ hs-how_can_we_help_you___contact_us_form_ hs-fieldtype-textarea field hs-form-field"
)[0];
const checkBoxField = document.getElementsByClassName(
  "legal-consent-container"
)[0];

// Helper function to create alerts
function createAlert(message) {
  const alert = document.createElement("ul");
  alert.classList.add("no-list", "hs-error-msgs", "inputs-list");
  alert.innerHTML = `
    <li>
      <label class="hs-error-msg hs-main-font-element">
        ${message}
      </label>
    </li>
  `;
  return alert;
}

// clear alert function
function clearAlert(type) {
  const firstNameAlert = firstNameField.querySelector("ul.hs-error-msgs");
  const emailAlert = emailField.querySelector("ul.hs-error-msgs");
  // Remove the `ul` alert for firstNameField
  if (firstNameAlert && type === "first-name") {
    firstNameField.removeChild(firstNameAlert);
  }
  // Remove the `ul` alert for emailField
  if (emailAlert && type === "email") {
    emailField.removeChild(emailAlert);
  }
  // Remove both alerts
  if (type === "first-name-and-email") {
    if (firstNameAlert) {
      firstNameField.removeChild(firstNameAlert);
    }
    if (emailAlert) {
      emailField.removeChild(emailAlert);
    }
  }
}

// Email validation function with 3 cases
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Case 1: Check if the email is empty
  if (email === "") {
    return { valid: false, message: "Please complete this required field." };
  }

  // Case 2: Check if the email format is invalid
  if (!emailPattern.test(email)) {
    return { valid: false, message: "Please enter a valid email." };
  }

  // Case 3: If the email is valid
  return { valid: true };
}

// setting variables
let currentStep = 0;

// Create the glass effect section
var glassSection = document.createElement("div");
glassSection.classList.add("glass-section");
glassSection.innerHTML = `
    <h1>Hello Conversion!</h1>
    <p>Click on the button below to contact us</p>
    <button id="open-modal" class="button">Click here</button>
  `;
formContainer.appendChild(glassSection);

// Create the modal structure
const modal = document.createElement("div");
modal.id = "modal";
modal.classList.add("modal");
modal.style.display = "none";
modal.innerHTML = `
    <div class="modal-content">
      <div class="progress-bar">
        <div class="step">
          <div class="step-icon-wrapper">
            <div class="step-icon">👤</div>
            <div class="step-title">User Information</div>
          </div>
          <div class="progress-line"></div>
        </div>
        <div class="step">
          <div class="step-icon-wrapper">
            <div class="step-icon">📄</div>
            <div class="step-title">Inquiry</div>
          </div>
          <div class="progress-line"></div>
        </div>
        <div class="step">
          <div class="step-icon-wrapper">
            <div class="step-icon">✔️</div>
            <div class="step-title">Complete</div>
          </div>
        </div>
      </div>
      <form id="multi-step-form">
        <div class="form-step step-1 active"></div>
        <div class="form-step step-2 hidden"></div>
        <div class="form-step step-3 hidden">
          <p class="thank-you-message" >Thank you for submitting the form!</p>
        </div>
        <div class="form-nav">
          <button type="button" id="prev-step">Back</button>
          <button type="button" id="next-step">Next</button>
        </div>
      </form>
    </div>
  `;
// console.log(modal);
document.body.appendChild(modal);

// Select parents elements from the modal form
const formStep1 = document.getElementsByClassName("form-step step-1")[0];
const formStep2 = document.getElementsByClassName("form-step step-2")[0];
const formNavigation = document.getElementsByClassName("form-nav")[0];

// select element from the modal
const formSteps = document.querySelectorAll(".form-step");
const progressBarSteps = document.querySelectorAll(".progress-bar .step");

const nextStepButton = document.getElementById("next-step");
const prevStepButton = document.getElementById("prev-step");
const openModalButton = document.getElementById("open-modal");

//  move the elements from original form to modal form
formStep1.appendChild(firstNameField);
formStep1.appendChild(lastNameField);
formStep1.appendChild(emailField);
formStep2.appendChild(howCanWeHelpYouField);
formStep2.appendChild(checkBoxField);
formStep2.appendChild(submitButtonContainer);

// update classes and text for submit button:
prevStepButton.classList.add("hidden");
submitButton.value = "Submit";

let FirstNameInput;
let EmailInput;

openModalButton.addEventListener("click", function () {
  //   console.log(modal.style.display);
  resetFormState();
  modal.style.display = "flex"; // Ensure modal opens
  updateButtonVisibility();

  // Variables to store input values
  let firstNameValue = "";
  let workEmailValue = "";

  // Get the input inside the cloned fields
  FirstNameInput = modal.querySelector(
    "#firstname-e259701f-aa68-4328-8ebf-013c47468869"
  );
  EmailInput = modal.querySelector(
    "#email-e259701f-aa68-4328-8ebf-013c47468869"
  );

  nextStepButton.style.cursor = "not-allowed"; // Optional: Disable cursor
  nextStepButton.style.opacity = "0.5";

  FirstNameInput.addEventListener("input", (event) => {
    firstNameValue = event.target.value;
    clearAlert((type = "first-name"));
    // clear disabled
    nextStepButton.disabled = false;
  });

  EmailInput.addEventListener("input", (event) => {
    workEmailValue = event.target.value;
    clearAlert((type = "email"));
    // clear disabled
    nextStepButton.disabled = false;
  });

  updateButtonVisibility();

  nextStepButton.addEventListener("click", function () {
    currentStep = 0;
    console.log(currentStep);
    // clear the error messages
    clearAlert((type = "first-name-and-email"));

    //create a varisble for tracking validation stages
    validFirstName = false;
    validEmail = false;

    // First name validation
    if (firstNameValue === "") {
      const alert = createAlert("Please complete this required field.");
      firstNameField.appendChild(alert);
    } else {
      validFirstName = true;
    }

    // Email validation
    const emailValidation = validateEmail(workEmailValue);

    // Check if email is valid
    if (!emailValidation.valid) {
      const alert = createAlert(emailValidation.message);
      emailField.appendChild(alert);
    } else {
      validEmail = true;
    }

    // Prevent moving to the next step if validations fail
    if (!validFirstName || !validEmail) {
      nextStepButton.disabled = true; // Disable by default when modal opens
      return;
    }

    if (currentStep < formSteps.length - 1) {
      formSteps[currentStep].classList.remove("active");
      formSteps[currentStep].classList.add("hidden");

      currentStep++;
      formSteps[currentStep].classList.remove("hidden");
      formSteps[currentStep].classList.add("active");

      updateProgressBar();
      updateButtonVisibility();
    }
  });

  prevStepButton.addEventListener("click", function () {
    // console.log("prev button pressed");
    if (currentStep > 0) {
      formSteps[currentStep].classList.remove("active");
      formSteps[currentStep].classList.add("hidden");

      currentStep--;
      formSteps[currentStep].classList.remove("hidden");
      formSteps[currentStep].classList.add("active");

      updateProgressBar();
      updateButtonVisibility();
    }
  });

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    // Move to the thank you step (Step 3)
    formSteps[currentStep].classList.remove("active");
    formSteps[currentStep].classList.add("hidden");

    currentStep++; // Move to the next step (Thank You message)
    formSteps[currentStep].classList.remove("hidden");
    formSteps[currentStep].classList.add("active");

    // Update button visibility and progress bar
    updateButtonVisibility();
    updateProgressBar();

    // Reset currentStep and form state after a short delay (e.g., 1 second)
  });
});

function updateProgressBar() {
  progressBarSteps.forEach(function (step, index) {
    const progressLine = step.querySelector(".progress-line");

    // Reset all steps to default state (grey background, grey progress line)
    step.classList.remove("active", "completed");

    // Handle completed steps
    if (index < currentStep) {
      step.classList.add("completed");
      step.querySelector(".step-icon").style.backgroundColor = "#007bff";

      // Animate the progress line width to 100% when completed
      if (progressLine) {
        progressLine.style.width = "100%"; // Fill the progress line
        progressLine.style.backgroundColor = "#007bff"; // Change to blue
      }
    }
    // Handle the current step
    else if (index === currentStep) {
      step.classList.add("active");
      step.querySelector(".step-icon").style.backgroundColor = "#007bff";
      step.querySelector(".step-title").style.fontWeight = "bold";

      // Keep the progress line grey for the current step
      if (progressLine) {
        progressLine.style.width = "0%"; // Reset width to 0%
        progressLine.style.backgroundColor = "lightgrey"; // Keep grey
      }
    }
    // Handle future steps
    else {
      step.querySelector(".step-icon").style.backgroundColor = "white";
      step.querySelector(".step-title").style.fontWeight = "normal";

      if (progressLine) {
        progressLine.style.width = "0%"; // Ensure future steps have a 0% width
        progressLine.style.backgroundColor = "lightgrey"; // Keep grey
      }
    }
  });

  // Special case for marking the third step as completed
  if (currentStep === progressBarSteps.length - 1) {
    const finalStep = progressBarSteps[currentStep];
    finalStep.classList.add("completed");
    finalStep.querySelector(".step-icon").style.backgroundColor = "#007bff";
  }
}

// Handle the next step and animate the progress line
function handleNextStep() {
  if (currentStep < formSteps.length - 1) {
    formSteps[currentStep].classList.remove("active");
    formSteps[currentStep].classList.add("hidden");

    currentStep++;
    formSteps[currentStep].classList.remove("hidden");
    formSteps[currentStep].classList.add("active");

    updateProgressBar();

    // Animate the progress line filling after 0.5s delay
    setTimeout(() => {
      const progressLine =
        progressBarSteps[currentStep - 1].querySelector(".progress-line");
      if (progressLine) {
        progressLine.style.width = "100%"; // Animate the line to fill
      }
    }, 500); // Match the duration of the width transition
  }
}

function updateButtonVisibility() {
  //   console.log("current step in updateButtonVisibility", currentStep);
  // first step
  if (currentStep === 0) {
    prevStepButton.classList.add("hidden");
    nextStepButton.classList.remove("hidden");
    //   last step
  } else if (currentStep === formSteps.length - 1) {
    prevStepButton.classList.add("hidden");
    nextStepButton.classList.add("hidden");
    //   all between steps
  } else {
    prevStepButton.classList.remove("hidden");
    nextStepButton.classList.add("hidden");
  }
}

function resetFormState() {
  // Reset current step to 0 (first step)
  currentStep = 0;

  // Hide all form steps
  formSteps.forEach((step) => {
    step.classList.add("hidden");
    step.classList.remove("active");
  });

  // Show the first step (step 1)
  formSteps[0].classList.add("active");

  // Update the button visibility and progress bar
  updateButtonVisibility();
  updateProgressBar();
}

// Function to reset all form inputs
function resetFormFields() {
  // Clear input fields
  firstNameField.querySelector("input").value = "";
  lastNameField.querySelector("input").value = "";
  emailField.querySelector("input").value = "";
  howCanWeHelpYouField.querySelector("textarea").value = "";
  checkBoxField.querySelector('input[type="checkbox"]').checked = false;

  // Clear any error messages
  clearAlert("first-name-and-email");
}

// Update the modal close event listener
modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
    resetFormState(); // Reset steps and progress bar
    resetFormFields(); // Reset the form fields and alerts
  }
});

// Also reset form state and fields when the modal is opened
openModalButton.addEventListener("click", function () {
  resetFormState(); // Reset steps and progress bar
  resetFormFields(); // Reset the form fields and alerts
  modal.style.display = "flex"; // Ensure modal opens
  updateButtonVisibility();
});
