
/** JS Code For Hamburger Menu **/
/** Declaring Variables **/
const toggle = document.querySelector(".toggle");
const navbar = document.querySelector(".navbar");
 
/** Toggle mobile menu **/
function toggleMenu() {
    if (navbar.classList.contains("active")) {
        navbar.classList.remove("active");
         
        // adds the menu (hamburger) icon
        toggle.querySelector("a").innerHTML = "<i class=\"fas fa-bars\"></i>";
    } else {
        navbar.classList.add("active");
         
        // adds the close (x) icon
        toggle.querySelector("a").innerHTML = "<i class=\"fas fa-times\"></i>";
    }
}
 
/** Event Listener **/
toggle.addEventListener("click", toggleMenu, false);

//##Declaration of functions for faq answers##//

function answers1(){
    let x=document.getElementById("answer1");
    
    if(x.style.display==="none"){
        x.style.display="block"
    }

    else{
        x.style.display= "none"
    }
}

function answers2(){
    let x=document.getElementById("answer2")
    
    if(x.style.display==="none"){
        x.style.display="block"
    }

    else{
        x.style.display= "none"
    }
}

function answers3(){
    let x=document.getElementById("answer3")

    if(x.style.display==="none"){
        x.style.display="block"
    }

    else{
        x.style.display= "none"
    }
}

function answers4(){
    let x=document.getElementById("answer4")

    if(x.style.display==="none"){
        x.style.display="block"
    }

    else{
        x.style.display= "none"
    }
}

function answers5(){
    let x=document.getElementById("answer5")

    if(x.style.display==="none"){
        x.style.display="block"
    }

    else{
        x.style.display= "none"
    }
}

function answers6(){
    let x=document.getElementById("answer6")

    if(x.style.display==="none"){
        x.style.display="block"
    }

    else{
        x.style.display= "none"
    }
}

function answers7(){
    let x=document.getElementById("answer7")

    if(x.style.display==="none"){
        x.style.display="block"
    }

    else{
        x.style.display= "none"
    }
}