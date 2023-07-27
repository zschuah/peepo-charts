const card = document.querySelector(".card");
const container = document.querySelector(".my-hover");
const peepo = document.querySelector("#peepo");

window.onresize = function () {
  togglePeepo();
};
function togglePeepo() {
  // console.log(window.innerHeight);
  // console.log(document.body.scrollHeight);
  if (window.innerHeight < 500) {
    peepo.style.display = "none";
  } else {
    peepo.style.display = "block";
  }
}

//Moving animation
container.addEventListener("mousemove", (e) => {
  let xAxis = (window.innerWidth / 2 - e.pageX) / 10;
  let yAxis = (window.innerHeight / 2 - e.pageY) / 10;
  card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

//Animate in
container.addEventListener("mouseenter", (e) => {
  card.style.transition = "none";
});

//Animate out
container.addEventListener("mouseleave", (e) => {
  card.style.transition = "all 0.5s ease";
  card.style.transform = `rotateY(0deg) rotateX(0deg)`;
});
