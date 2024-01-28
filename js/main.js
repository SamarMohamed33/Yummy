let navOpened = false;
$(function () {
  $(".loader").fadeOut(500, function () {
    $("body").css("overflow", "auto");
  });
});
$("#menu-icon").on("click", function () {
  let navWidth = $(".nav-container").outerWidth();
  if (navOpened === false) {
    $("nav").animate({ left: "0" });
    for (let i = 0; i < 5; i++) {
      $(".nav-container ul li")
        .eq(i)
        .animate(
          {
            top: 0,
          },
          (i + 5) * 100
        );
    }
    navOpened = true;
  } else {
    $("nav").animate({ left: -navWidth });
    for (let i = 0; i < 5; i++) {
      $(".nav-container ul li")
        .eq(i)
        .animate(
          {
            top: "150px",
          },
          (i + 5) * 100
        );
    }
    navOpened = false;
  }
});

async function getMeals() {
  $(".items").html("");
  $(".loader").fadeIn(500);
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  let result = await response.json();
  displayMeals(result.meals);
  $(".loader").fadeOut(500);
}
// call getMeals to Load the page at the first time and display random meals
getMeals();

// Display Meals after get them from the API
function displayMeals(data) {
  let cartona = ``;
  for (let i = 0; i < data.length; i++) {
    cartona += `
        <div class="col-md-3">
        <div class="item" onclick="getMealDetails(${data[i].idMeal})">
          <img
            src="${data[i].strMealThumb}"
            class="w-100 rounded-3"
            alt="" />
          <div class="image-overlay rounded-3 d-flex justify-content-center align-items-center fw-bolder fs-2">
            <p class="text-dark">${data[i].strMeal}</p>
          </div>
        </div>
      </div>
        `;
  }
  document.querySelector(".items").innerHTML = cartona;
}
// get meal's details after clicking any meal
async function getMealDetails(mealId) {
  $(".items").html("");
  $(".loader").fadeIn(500);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let result = await response.json();
  displayMealDetails(result.meals[0]);
  $(".loader").fadeOut(500);
}
// Display the meal details
function displayMealDetails(meal) {
  const recipeList = [];
  for (let i = 0; i < 20; i++) {
    if (meal["strIngredient" + [i + 1]])
      recipeList.push(
        meal["strMeasure" + [i + 1]] + " " + meal["strIngredient" + [i + 1]]
      );
  }
  let cartona = `
  <div class="col-md-4">
            <img src="${
              meal.strMealThumb
            }" class="w-100 pb-2 rounded-3" alt="" />
            <h2>${meal.strMeal}</h2>
          </div>
          <div class="col-md-8">
            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>
            <h3>Area : ${meal.strArea}</h3>
            <h3>Category : ${meal.strCategory}</h3>
            <h3>Recipes :</h3>
            ${recipeList.map((el) => {
              return `<span class="badge alert alert-info p-3 m-1 rounded-2">${el}</span>`;
            })}
            <h3>Tags :</h3>
            ${
              meal.strTags !== null
                ? meal.strTags.split(",").map((el) => {
                    return `<span class="badge alert alert-danger p-3 m-1 rounded-2">${el}</span>`;
                  })
                : "No Tags"
            }
            
            <div class="my-4">
              <a href="${
                meal.strSource
              }" class="btn btn-success me-2" target="_blank">Source</a>
              <a href="${
                meal.strYoutube
              }" class="btn btn-danger" target="_blank">Youtube</a>
            </div>
          </div>
  `;

  document.querySelector(".items").innerHTML = cartona;
}
// Display Search Page after clicking Search Item in the navbar
function search() {
  $("nav").animate({ left: -$(".nav-container").outerWidth() });
  $(".loader").fadeIn(500);

  let searchHTML = `
  <div class="row d-flex justify-content-center align-items-center">
  <div class="col-8 col-md-5 m-2"><input type="text" class="form-control" placeholder="Search by Name" onkeyup="searchByName(this.value)"/></div>
  <div class="col-8 col-md-5 m-2"><input type="text" class="form-control" placeholder="Search by First Letter" maxlength="1" onkeyup="searchByFirstLetter(this.value)"/></div>
  </div>
  <div id="results" class="row gy-4">
  </div>
  `;
  $(".items").html(searchHTML);
  $(".loader").fadeOut(500);
}
// Get all the meals having the name  entered by the user from the API and send them to searchResults() Function
async function searchByName(mealName) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
  );
  let result = await response.json();
  searchResults(result.meals);
}
// Get all the meals having the first letter entered by the user from the API and send them to searchResults() Function
async function searchByFirstLetter(letter) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  let result = await response.json();
  searchResults(result.meals);
}
//Display the meals for  each search option
function searchResults(meals) {
  let results = ``;
  for (let i = 0; i < meals.length; i++) {
    results += `
        <div class="col-md-3">
        <div class="item" onclick="getMealDetails(${meals[i].idMeal})">
          <img
            src="${meals[i].strMealThumb}"
            class="w-100 rounded-3"
            alt="" />
          <div class="image-overlay rounded-3 d-flex justify-content-center align-items-center fw-bolder fs-2">
            <p class="text-dark">${meals[i].strMeal}</p>
          </div>
        </div>
      </div>
        `;
  }
  $("#results").html(results);
}
// Get All the Categories after clicking Categories Item in the navbar
async function getCategories() {
  $(".items").html("");
  $("nav").animate({ left: -$(".nav-container").outerWidth() });
  $(".loader").fadeIn(500);
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let result = await response.json();
  displayCategories(result.categories);
  $(".loader").fadeOut(500);
}
// Display All the Categories after getting them from getCategories() Function
function displayCategories(categories) {
  let cartona = ``;
  for (let i = 0; i < categories.length; i++) {
    cartona += `
          <div class="col-md-3">
          <div class="item"  onclick="getMealsByCategory('${
            categories[i].strCategory
          }')">
            <img
              src="${categories[i].strCategoryThumb}"
              class="w-100 rounded-3"
              alt="" />
            <div class="image-overlay rounded-3 text-center text-dark p-2">
              <h3>${categories[i].strCategory}</h3>
              <p>${categories[i].strCategoryDescription
                .split(" ")
                .splice(0, 20)
                .join(" ")}</p>
            </div>
          </div>
        </div>
          `;
  }
  document.querySelector(".items").innerHTML = cartona;
}
// Get meals of a specific category and send them to displayMeals() Function To Display them
async function getMealsByCategory(category) {
  $(".items").html("");
  $(".loader").fadeIn(500);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let result = await response.json();
  displayMeals(result.meals);
  $(".loader").fadeOut(500);
}
// Get All the Areas after clicking Areas Item in the navbar
async function getAreas() {
  $(".items").html("");
  $("nav").animate({ left: -$(".nav-container").outerWidth() });
  $(".loader").fadeIn(500);
  let response = await fetch(
    "http://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  let result = await response.json();
  displayAreas(result.meals);
  $(".loader").fadeOut(500);
}
// Display All the Areas after getting them from getAreas() Function
function displayAreas(areas) {
  let cartona = ``;
  for (let i = 0; i < areas.length; i++) {
    cartona += `
            <div class="col-md-3 text-center">
            <div class="item" onclick="getMealsByAreas('${areas[i].strArea}')">
            <i class="fa-solid fa-house-flag fs-1"></i>
            <h2 class="pt-1">${areas[i].strArea}</h2>
            </div>
          </div>
            `;
  }
  document.querySelector(".items").innerHTML = cartona;
}
// Get meals of a specific area and send them to displayMeals() Function To Display them
async function getMealsByAreas(area) {
  $(".items").html("");
  $(".loader").fadeIn(500);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let result = await response.json();
  displayMeals(result.meals);
  $(".loader").fadeOut(500);
}
// Get All the Ingredients after clicking Ingredients Item in the navbar
async function getIngredients() {
  $(".items").html("");
  $("nav").animate({ left: -$(".nav-container").outerWidth() });
  $(".loader").fadeIn(500);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let result = await response.json();
  displayIngredients(result.meals);
  $(".loader").fadeOut(500);
}
// Display All the Ingredients after getting them from getIngredients() Function
function displayIngredients(Ingredients) {
  let cartona = ``;
  for (let i = 0; i < 25; i++) {
    cartona += `
            <div class="col-md-3 text-center">
            <div class="item" onclick="getMealsByIngredients('${
              Ingredients[i].strIngredient
            }')">
            <i class="fa-solid fa-drumstick-bite fs-1"></i>
            <h3 class="pt-1">${Ingredients[i].strIngredient}</h3>
            <p>${Ingredients[i].strDescription
              .split(" ")
              .splice(0, 20)
              .join(" ")}</p>
            </div>
          </div>
            `;
  }
  document.querySelector(".items").innerHTML = cartona;
}
// Get meals of a specific Ingredient and send them to displayMeals() Function To Display them
async function getMealsByIngredients(Ingredient) {
  $(".items").html("");
  $(".loader").fadeIn(500);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingredient}`
  );
  let result = await response.json();
  displayMeals(result.meals);
  $(".loader").fadeOut(500);
}

let emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
let passwordValidation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
let nameValidation = /^[a-zA-Z ]{2,}$/;
let ageValidation = /^[1-9][0-9]?$/;
let phoneValidation = /^01[0-2,5]{1}[0-9]{8}$/;
function contactUs() {
  $("nav").animate({ left: -$(".nav-container").outerWidth() });
  $(".loader").fadeIn(500);

  let contactForm = `
  <div class="contact-form">
  <h1 class="text-center mb-5">Contact US</h1>
  <div class="row h-100 d-flex justify-content-center align-items-center">
    <div class="col-md-5 my-2">
    <input type="text" class="form-control name" onkeyup="testNameValidation()" placeholder="Enter Your Name" name="name"/>
    <span class="error alert alert-danger text-center p-1 mt-1">Special characters and numbers not allowed</span>
    </div>
    <div class="col-md-5 my-2">
    <input type="email" class="form-control email" onkeyup="testEmailValidation()" placeholder="Enter Your Email" name="email"/>
    <span class="error alert alert-danger text-center p-1 mt-1">Email not valid *exemple@yyy.zzz</span>
    </div>
    <div class="col-md-5 my-2">
    <input type="text" class="form-control phone" onkeyup="testPhoneValidation()" placeholder="Enter Your Phone" name="phone"/>
    <span class="error alert alert-danger text-center p-1 mt-1"> Enter valid Phone Number</span>
    </div>
    <div class="col-md-5 my-2">
    <input type="number" class="form-control age" onkeyup="testAgeValidation()" placeholder="Enter Your Age" name="Age"/>
    <span class="error alert alert-danger text-center p-1 mt-1">Enter valid age</span>
    </div>
    <div class="col-md-5 my-2">
    <input type="password" class="form-control pass1" onkeyup="testPasswordValidation()" placeholder="Enter Your Password" name="pass1"/>
    <span class="error alert alert-danger text-center p-1 mt-1">Enter valid password *Minimum eight characters, at least one letter and one number:*</span>
    </div>
    <div class="col-md-5 my-2">
    <input type="password" class="form-control pass2" onkeyup="checkPasswordRepeat()" placeholder="Enter Your Password Again" name="pass2"/>
    <span class="error alert alert-danger text-center p-1 mt-1">Password doesn't match</span>
    </div>
    <button type="submit" class="btn btn-outline-danger col-md-3 m-4 submit-btn" disabled="true">Submit</button>
  </div>
  </div>
  `;
  $(".items").html(contactForm);
  $(".loader").fadeOut(500);
}
// function checkValidation() {
//   if (
//     testNameValidation() &&
//     testEmailValidation() &&
//     testPhoneValidation() &&
//     testAgeValidation() &&
//     testPasswordValidation() &&
//     checkPasswordRepeat()
//   ) {
//     console.log("contact done");
//     document.querySelector(".submit-btn").setAttribute("disabled", false);
//   } else {
//     console.log("contact not done");
//   }
// }

function checkInput(input, valueTest) {
  if (valueTest.test(input.value)) {
    input.nextElementSibling.style.display = "none";
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.nextElementSibling.style.display = "block";
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    return false;
  }
}
function testNameValidation() {
  if (checkInput(document.querySelector(".name"), nameValidation)) {
    if (checkValidClass()) return true;
    else return false;
  } else {
    checkValidClass();
    return false;
  }
}
function testEmailValidation() {
  if (checkInput(document.querySelector(".email"), emailValidation)) {
    if (checkValidClass()) return true;
    else return false;
  } else {
    checkValidClass();
    return false;
  }
}
function testPhoneValidation() {
  if (checkInput(document.querySelector(".phone"), phoneValidation)) {
    if (checkValidClass()) return true;
    else return false;
  } else {
    checkValidClass();
    return false;
  }
}
function testAgeValidation() {
  if (checkInput(document.querySelector(".age"), ageValidation)) {
    if (checkValidClass()) return true;
    else return false;
  } else {
    checkValidClass();
    return false;
  }
}
function testPasswordValidation() {
  if (checkInput(document.querySelector(".pass1"), passwordValidation)) {
    if (checkValidClass()) return true;
    else return false;
  } else {
    checkValidClass();
    return false;
  }
}
function checkPasswordRepeat() {
  const pass2Field = document.querySelector(".pass2");
  if (pass2Field.value == document.querySelector(".pass1").value) {
    pass2Field.nextElementSibling.style.display = "none";
    pass2Field.classList.add("is-valid");
    pass2Field.classList.remove("is-invalid");
    if (checkValidClass()) return true;
    else return false;
  } else {
    pass2Field.nextElementSibling.style.display = "block";
    pass2Field.classList.remove("is-valid");
    pass2Field.classList.add("is-invalid");
    checkValidClass();
    return false;
  }
}
function checkValidClass() {
  let validFields = 0;
  $("input")
    .toArray()
    .forEach(function (el) {
      if (el.classList.contains("is-valid")) validFields++;
    });
  if (validFields === 6) {
    document.querySelector(".submit-btn").disabled = false;
    return true;
  } else {
    document.querySelector(".submit-btn").disabled = true;
    return false;
  }
}
