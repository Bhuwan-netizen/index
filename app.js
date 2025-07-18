const wrapper = document.querySelector(".sliderwrapper");
const menuItems = document.querySelectorAll(".menuitem");

const products = [
  {
    id: 1,
    title: "Air Force",
    price: 119,
    colors: [
      { code: "black", img: "./img/air.png" },
      { code: "darkblue", img: "./img/air2.png" },
    ],
  },
  {
    id: 2,
    title: "Air Jordan",
    price: 149,
    colors: [
      { code: "lightgray", img: "./img/jordan.png" },
      { code: "green", img: "./img/jordan2.png" },
    ],
  },
  {
    id: 3,
    title: "Blazer",
    price: 109,
    colors: [
      { code: "lightgray", img: "./img/blazer.png" },
      { code: "green", img: "./img/blazer2.png" },
    ],
  },
  {
    id: 4,
    title: "Crater",
    price: 129,
    colors: [
      { code: "black", img: "./img/crater.png" },
      { code: "lightgray", img: "./img/crater2.png" },
    ],
  },
  {
    id: 5,
    title: "Hippie",
    price: 99,
    colors: [
      { code: "gray", img: "./img/hippie.png" },
      { code: "black", img: "./img/hippie2.png" },
    ],
  },
];

// Selected product
let chosenProduct = products[0];

// DOM elements for the product display
const currentProductImg = document.querySelector(".productimg");
const currentProductTitle = document.querySelector(".producttitle");
const currentProductPrice = document.querySelector(".productprice");
const currentProductColors = document.querySelectorAll(".color");
const currentProductSizes = document.querySelectorAll(".size");

// Menu item click event
menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    // Move slider
    wrapper.style.transform = `translateX(${-100 * index}vw)`;

    // Update chosen product
    chosenProduct = products[index];

    // Update product content
    if (currentProductTitle) currentProductTitle.textContent = chosenProduct.title;
    if (currentProductPrice) currentProductPrice.textContent = `$${chosenProduct.price}`;
    if (currentProductImg) currentProductImg.src = chosenProduct.colors[0].img;

    // Update color options
    currentProductColors.forEach((color, colorIndex) => {
      if (chosenProduct.colors[colorIndex]) {
        color.style.backgroundColor = chosenProduct.colors[colorIndex].code;
      }
    });
  });
});

// Change product image when color is clicked
currentProductColors.forEach((color, index) => {
  color.addEventListener("click", () => {
    if (chosenProduct.colors[index]) {
      currentProductImg.src = chosenProduct.colors[index].img;
    }
  });
});
