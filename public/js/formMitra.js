/* eslint-disable no-undef */
//function untuk HSE Plan.
$(document).ready(function () {
// Function to show the HSE Plan form
function showHSEPlanForm() {
    $("#hsePlanForm").removeClass("hidden");
    $("#hsePlanForm").addClass("animate__animated animate__bounceIn my-element");
    $("#psbForm, #pbForm, #paForm").addClass("hidden");
}

// Event listener for the HSE PLAN button
$("#hsePlanButton").click(function () {
    showHSEPlanForm();
});

// ... (Add similar code for other buttons if needed)
});

//function untuk PSB
$(document).ready(function (){

//function utk membuka PSB form.
function showPSBForm(){
    $("#psbForm").removeClass("hidden");
    $("#psbForm").addClass("animate__animated animate__bounceIn my-element");
    $("#hsePlanForm, #pbForm, #paForm").addClass("hidden");
}

//tambah event listener function.
$("#psbButton").click(function(){
    showPSBForm();
})
});

//function utk PB
$(document).ready(function (){

//function utk membuka PSB form.
function showPBForm(){
    $("#pbForm").removeClass("hidden");
    $("#pbForm").addClass("animate__animated animate__bounceIn my-element");
    $("#psbForm, #hsePlanForm, #paForm").addClass("hidden");
}

//tambah event listener function.
$("#pbButton").click(function(){
    showPBForm();
})
});

//function utk PA
$(document).ready(function (){

//function utk membuka PSB form.
function showPAForm(){
    $("#paForm").removeClass("hidden");
    $("#paForm").addClass("animate__animated animate__bounceIn my-element");
    $("#psbForm, #hsePlanForm, #pbForm").addClass("hidden");
}

//tambah event listener function.
$("#paButton").click(function(){
    showPAForm();
});
});