// Membuat inisial
let draggableObjects;
let dropPoints;
const startButton = document.getElementById("start");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");
const data = [
  "belgium",
  "bhutan",
  "brazil",
  "china",
  "cuba",
  "ecuador",
  "georgia",
  "germany",
  "hong-kong",
  "india",
  "iran",
  "myanmar",
  "norway",
  "spain",
  "sri-lanka",
  "sweden",
  "switzerland",
  "united-states",
  "uruguay",
  "wales",
];

let deviceType = "";
let initialX = 0,
  initialY = 0;
let currentElement = "";
let moveElement = false;

// Mendeteksi kursor
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

let count = 0;

// Nilai acak dari susunan
const randomValueGenerator = () => {
  return data[Math.floor(Math.random() * data.length)];
};

// Inisial untuk menang
const stopGame = () => {
  controls.classList.remove("hide");
  startButton.classList.remove("hide");
};

// Memindahkan gambar ke bagian layar teks
function dragStart(e) {
  if (isTouchDevice()) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
    // Mengaktifkan gerakan element menggunakan kursor
    moveElement = true;
    currentElement = e.target;
  } else {
    e.dataTransfer.setData("text", e.target.id);
  }
}

// Bendera diletakkan ke tempat sasaran(nama bendera yang sesuai)
function dragOver(e) {
  e.preventDefault();
}

// Untuk gerakan kursor
const touchMove = (e) => {
  if (moveElement) {
    e.preventDefault();
    let newX = e.touches[0].clientX;
    let newY = e.touches[0].clientY;
    let currentSelectedElement = document.getElementById(e.target.id);
    currentSelectedElement.parentElement.style.top =
      currentSelectedElement.parentElement.offsetTop - (initialY - newY) + "px";
    currentSelectedElement.parentElement.style.left =
      currentSelectedElement.parentElement.offsetLeft -
      (initialX - newX) +
      "px";
    initialX = newX;
    initialY - newY;
  }
};

const drop = (e) => {
  e.preventDefault();
  // Menonaktifkan gerakan element menggunakan kursor
  if (isTouchDevice()) {
    moveElement = false;
    // Pilihan nama negara teracak
    const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
    // Batasan bendera
    const currentDropBound = currentDrop.getBoundingClientRect();
    // Jika posisi bendera jatuh di dalam batas nama negara
    if (
      initialX >= currentDropBound.left &&
      initialX <= currentDropBound.right &&
      initialY >= currentDropBound.top &&
      initialY <= currentDropBound.bottom
    ) {
      currentDrop.classList.add("dropped");
      // Menyembunyikan halaman permainan alias menang
      currentElement.classList.add("hide");
      currentDrop.innerHTML = ``;
      // Memasukkan elemen gambar baru
      currentDrop.insertAdjacentHTML(
        "afterbegin",
        `<img src= "${currentElement.id}.png">`
      );
      count += 1;
    }
  } else {
    // Mencari akses gambar 
    const draggedElementData = e.dataTransfer.getData("text");
    // Mendapat gambar secara teracak/khusus
    const droppableElementData = e.target.getAttribute("data-id");

    if (draggedElementData === droppableElementData) {
      const draggedElement = document.getElementById(draggedElementData);
      // Meletakkan gambar
      e.target.classList.add("dropped");
      draggedElement.classList.add("hide");
      draggedElement.setAttribute("draggable", "false");
      e.target.innerHTML = ``;
      // Mencari gambar baru
      e.target.insertAdjacentHTML(
        "afterbegin",
        `<img src="${draggedElementData}.png">`
      );
      count += 1;
    }
  }

  // Menang
  if (count == 3) {
    result.innerText = `You Won!`;
    stopGame();
  }
};

// Membuat bendera dan nama negara
const creator = () => {
  dragContainer.innerHTML = "";
  dropContainer.innerHTML = "";
  let randomData = [];

  // Pemilihan data gambar teracak
  for (let i = 1; i <= 3; i++) {
    let randomValue = randomValueGenerator();
    if (!randomData.includes(randomValue)) {
      randomData.push(randomValue);
    } else {
      i -= 1;
    }
  }
  for (let i of randomData) {
    const flagDiv = document.createElement("div");
    flagDiv.classList.add("draggable-image");
    flagDiv.setAttribute("draggable", true);
    if (isTouchDevice()) {
      flagDiv.style.position = "absolute";
    }
    flagDiv.innerHTML = `<img src="${i}.png" id="${i}">`;
    dragContainer.appendChild(flagDiv);
  }
  
  randomData = randomData.sort(() => 0.5 - Math.random());
  for (let i of randomData) {
    const countryDiv = document.createElement("div");
    countryDiv.innerHTML = `<div class='countries' data-id='${i}'>
    ${i.charAt(0).toUpperCase() + i.slice(1).replace("-", " ")}
    </div>`;
    dropContainer.appendChild(countryDiv);
  }
};

// Memulai permainan
startButton.addEventListener(
  "click",
  (startGame = async () => {
    currentElement = "";
    controls.classList.add("hide");
    startButton.classList.add("hide");

    // Menampilkan halaman permainan
    await creator();
    count = 0;
    dropPoints = document.querySelectorAll(".countries");
    draggableObjects = document.querySelectorAll(".draggable-image");

    // Permainan
    draggableObjects.forEach((element) => {
      element.addEventListener("dragstart", dragStart);
      // Untuk kursor
      element.addEventListener("touchstart", dragStart);
      element.addEventListener("touchend", drop);
      element.addEventListener("touchmove", touchMove);
    });
    dropPoints.forEach((element) => {
      element.addEventListener("dragover", dragOver);
      element.addEventListener("drop", drop);
    });
  })
);