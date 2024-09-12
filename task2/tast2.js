// Drawer + Slider
const updatedDrawerWithSlider = `
  <div class="sticky-drawer drawer-hidden" id="stickyDrawer">
    <div class="drawer-content-text">Sticky Drawer</div>
    <div class="navigation-container">
        <div class="arrow-container" id="arrow-container">
            <div class="slider-arrow left" id="prevArrow"><</div>
             <div id="slide-counter"> 1 / 3 </div>
            <div class="slider-arrow right" id="nextArrow">></div>
        </div>
        <div class="drawer-tab" id="drawerTab">^</div>
    </div>
  </div>
  
  <div class="slider-container" id="sliderContainer">
    <div class="slides" id="slides">
      <div class="slide">Slide 1</div>
      <div class="slide">Slide 2</div>
      <div class="slide">Slide 3</div>
      <div class="slide">Slide 4</div>
      <div class="slide">Slide 5</div>
      <div class="slide">Slide 6</div>
      <div class="slide">Slide 7</div>
    </div>
  </div>
  
  <div class="overlay" id="overlay"></div>
`;

// Inject the updated structure into the body
document.body.insertAdjacentHTML("beforeend", updatedDrawerWithSlider);

let currentSlide = 0;
const totalSlides = 7; // We have 7 slides
let slidesPerView;
// for mobile device dragging functionality:
let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let previousTranslate = 0;
let animationID = 0;
let slideWidth = 0;
let isSwiping = false;
const dragThreshold = 10; // Minimum distance for a valid drag
let movedBy = 0; //
const slidesElement = document.getElementById("slides");
const slideCounter = document.getElementById("slide-counter");
const drawerElement = document.getElementById("stickyDrawer");
const overlayElement = document.getElementById("overlay");
const nextArrow = document.getElementById("nextArrow");
const prevArrow = document.getElementById("prevArrow");
const arrowContainer = document.getElementById("arrow-container");

// Function to update slidesPerView based on the viewport

function updateSlidesPerView() {
  if (window.innerWidth >= 1024) {
    slidesPerView = 4; // Desktop view: 4 slides
  } else if (window.innerWidth >= 768) {
    slidesPerView = 2; // Tablet view: 2 slides
  } else {
    slidesPerView = 1; // Mobile view: 1 slide
  }
  // Recalculate the width of a slide
  slideWidth = slidesElement.clientWidth / slidesPerView;
  updateSlidePosition();
  updateSlideCounter();
}

// Initial call to set slidesPerView based on the current viewport
updateSlidesPerView();

// Function to update the slider position based on the current slide
function updateSlidePosition() {
  const offset = currentSlide * -slideWidth;
  slidesElement.style.transform = `translateX(${offset}px)`;
  previousTranslate = offset;
}

// Function to update the slide counter
function updateSlideCounter() {
  const currentContainer = Math.floor(currentSlide / slidesPerView) + 1;
  const totalContainers = Math.ceil(totalSlides / slidesPerView);
  slideCounter.textContent = `${currentContainer} / ${totalContainers}`;
}

// Add event listeners for the arrows
nextArrow.addEventListener("click", function () {
  if (currentSlide < totalSlides - slidesPerView) {
    currentSlide += slidesPerView;
    updateSlidePosition();
    updateSlideCounter();
  }
});

prevArrow.addEventListener("click", function () {
  if (currentSlide > 0) {
    currentSlide -= slidesPerView;
    updateSlidePosition();
    updateSlideCounter();
  }
});

// Recalculate the number of visible slides when the window is resized
window.addEventListener("resize", function () {
  updateSlidesPerView();
  updateSlidePosition(); // Recalculate the slide position when the layout changes
});

// Toggle drawer visibility
const tabElement = document.getElementById("drawerTab");

// Call the function to fetch and populate slides when the drawer is opened
tabElement.addEventListener("click", function () {
  drawerElement.classList.toggle("drawer-hidden");
  drawerElement.classList.toggle("drawer-visible");
  tabElement.classList.toggle("rotate");

  // Fetch and populate the slides when opening the drawer
  if (drawerElement.classList.contains("drawer-visible")) {
    fetchAndPopulateSlides();
  }

  // Toggle the visibility of the arrow container
  if (drawerElement.classList.contains("drawer-visible")) {
    arrowContainer.style.visibility = "visible"; // Show the arrows
  } else {
    arrowContainer.style.visibility = "hidden"; // Hide the arrows, keeping their space
  }
});

// Close the drawer when the overlay is clicked
overlayElement.addEventListener("click", function () {
  drawerElement.classList.add("drawer-hidden");
  drawerElement.classList.remove("drawer-visible");
  tabElement.classList.remove("rotate");
});

// Close the drawer when scrolling hits the bottom
window.addEventListener("scroll", function () {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    drawerElement.classList.add("drawer-hidden");
    drawerElement.classList.remove("drawer-visible");
    tabElement.classList.remove("rotate");
  }
});

// Function to fetch + populate the list of Pokemon
async function fetchAndPopulateSlides() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=50");
    const data = await response.json();

    //  Randomly select 7 Pokemon
    const randomPokemons = [];
    while (randomPokemons.length < 7) {
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const selectedPokemon = data.results[randomIndex];
      if (!randomPokemons.includes(selectedPokemon)) {
        randomPokemons.push(selectedPokemon);
      }
    }

    //Fetch details for the selected 7 Pokémon
    const pokemonDetailsPromises = randomPokemons.map((pokemon) =>
      fetch(pokemon.url).then((res) => res.json())
    );
    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    // Populate slides with the fetched Pokémon details
    const slidesElement = document.getElementById("slides");
    slidesElement.innerHTML = ""; // Clear existing slides if any

    pokemonDetails.forEach((pokemon) => {
      // Create the slide container
      const slide = document.createElement("div");
      slide.classList.add("slide");

      // Create the flip container and card elements
      const flipContainer = document.createElement("div");
      flipContainer.classList.add("flip-container");

      const flipCard = document.createElement("div");
      flipCard.classList.add("flip-card");

      const cardFront = document.createElement("div");
      cardFront.classList.add("flip-card-front");
      cardFront.style.backgroundImage = `url(${pokemon.sprites.front_default})`;
      cardFront.innerHTML = `
  <h3 class="card-header">${pokemon.name}</h3>
  <div class="pokemon-info">
    <p>Height: ${pokemon.height}</p>
    <p>Weight: ${pokemon.weight}</p>
    <p>Base Experience: ${pokemon.base_experience}</p>
  </div>
  <button class="flip-button">Flip</button>
      <div class="tooltip">
      i
      <span class="tooltip-text">${pokemon.name}</span>
      </div>
`;

      const cardBack = document.createElement("div");
      cardBack.classList.add("flip-card-back");
      cardBack.style.backgroundImage = `url(${pokemon.sprites.back_default})`;
      cardBack.innerHTML = `
  <h3 class="card-header">${pokemon.name}</h3>
  <div class="pokemon-info">
    <p>Height: ${pokemon.height}</p>
    <p>Weight: ${pokemon.weight}</p>
    <p>Base Experience: ${pokemon.base_experience}</p>
  </div>
  <button class="flip-button">Flip</button>
        <div class="tooltip">i
      <span class="tooltip-text">${pokemon.name}</span>
      </div>
`;

      // Add event listeners to flip the card
      cardFront
        .querySelector(".flip-button")
        .addEventListener("click", function () {
          flipCard.classList.toggle("flipped");
        });

      cardBack
        .querySelector(".flip-button")
        .addEventListener("click", function () {
          flipCard.classList.toggle("flipped");
        });

      // Append front and back cards to the flip card container
      flipCard.appendChild(cardFront);
      flipCard.appendChild(cardBack);

      // Append the flip card to the flip container
      flipContainer.appendChild(flipCard);

      // Append the flip container to the slide container
      slide.appendChild(flipContainer);

      // Append the slide container to the slides element
      slidesElement.appendChild(slide);
    });

    updateSlidePosition(); // Ensure the slider updates with the new content
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}
// for sliding and dragging for mobile devices

// Function to check if it's a mobile view (for screens <= 768px)
function isMobileView() {
  return window.innerWidth <= 768;
}

// Update slide width based on the current screen size
function updateSlideWidth() {
  slideWidth = slidesElement.clientWidth / slidesPerView; // Each slide width based on the number of visible slides
}

// Dragging and Swiping functionality for mobile
function touchStart(event) {
  if (!isMobileView() || event.target.closest(".flip-button")) return;

  isDragging = true;
  startPosition = getPositionX(event);
  animationID = requestAnimationFrame(animation);
  slidesElement.style.transition = "none";
  movedBy = 0;
}

function touchEnd() {
  if (!isDragging || !isMobileView() || event.target.closest(".flip-button"))
    return;

  isDragging = false;
  cancelAnimationFrame(animationID);

  // Only allow a swipe if the movement exceeds the drag threshold
  if (Math.abs(movedBy) > dragThreshold) {
    if (
      movedBy < -slideWidth * 0.3 &&
      currentSlide < totalSlides - slidesPerView
    ) {
      currentSlide += 1; // Go to the next slide
    } else if (movedBy > slideWidth * 0.3 && currentSlide > 0) {
      currentSlide -= 1; // Go to the previous slide
    }
  }

  updateSlidePosition(); // Move to the current slide
  slidesElement.style.transition = "transform 0.4s ease"; // Smooth transition after dragging
  updateSlideCounter(); // Update slide counter
}

function touchMove(event) {
  if (!isDragging || !isMobileView()) return;

  const currentPosition = getPositionX(event);
  movedBy = currentPosition - startPosition; // Track how much the user has moved
  currentTranslate = previousTranslate + movedBy;
}

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function animation() {
  if (isDragging) {
    setSliderPosition();
    requestAnimationFrame(animation);
  }
}

function setSliderPosition() {
  slidesElement.style.transform = `translateX(${currentTranslate}px)`;
}

// Function to update the slider position to the current slide
function updateSlidePosition() {
  const offset = currentSlide * -slideWidth;
  slidesElement.style.transform = `translateX(${offset}px)`;
  previousTranslate = offset;
}

// Add drag events for mobile devices
function addDragEvents() {
  if (isMobileView()) {
    slidesElement.addEventListener("touchstart", touchStart);
    slidesElement.addEventListener("touchend", touchEnd);
    slidesElement.addEventListener("touchmove", touchMove);

    slidesElement.addEventListener("mousedown", touchStart);
    slidesElement.addEventListener("mouseup", touchEnd);
    slidesElement.addEventListener("mouseleave", touchEnd);
    slidesElement.addEventListener("mousemove", touchMove);
  } else {
    removeDragEvents(); // Remove dragging on non-mobile screens
  }
}

// Function to remove drag events for non-mobile devices

function removeDragEvents() {
  slidesElement.removeEventListener("touchstart", touchStart);
  slidesElement.removeEventListener("touchend", touchEnd);
  slidesElement.removeEventListener("touchmove", touchMove);

  slidesElement.removeEventListener("mousedown", touchStart);
  slidesElement.removeEventListener("mouseup", touchEnd);
  slidesElement.removeEventListener("mouseleave", touchEnd);
  slidesElement.removeEventListener("mousemove", touchMove);
}

// Function to check if it's a mobile view (for screens <= 768px)
function isMobileView() {
  return window.innerWidth <= 768;
}

// Handle screen resize and update everything accordingly
window.addEventListener("resize", () => {
  updateSlidesPerView(); // Update slides and width based on new viewport size
  addDragEvents(); // Reapply drag events based on the screen size
});

// Initial setup for dragging/swiping based on the current screen size
updateSlidesPerView();
addDragEvents();
