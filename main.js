let posting = document.querySelector("#post_btn");
let postname = document.querySelector("#post_name");
let postname_edit = document.querySelector("#post_name_edit");
let postlink_edit = document.querySelector("#post_img_edit");
let postlink = document.querySelector("#post_img");
// let like = document.querySelector("#like_btn");
let deleteBtn = document.querySelector("#delete_btn");
let editBtn = document.querySelector("#edit_btn");
let applyChangesBtn = document.querySelector("#apply_btn");
let dropdown = document.querySelector("#dropdown");
let survey = document.querySelector("#post_survey");
let editing = document.querySelector("#post_editing");

const POSTS_API = "http://localhost:8000/posts";

posting.addEventListener("click", post);

async function post() {
  let postData = {
    name: postname.value,
    img: postlink.value,
    likes: 0,
  };
  fetch(POSTS_API, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  alert("Post created succesfully!");
  postname.value = "";
  postlink.value = "";
  render();
}

let currentPage = 1;
let search = "";

async function render() {
  let productsList = document.querySelector("#products-list");
  productsList.innerHTML = "";
  let api = `${POSTS_API}?q=${search}&_page=${currentPage}&_limit=5`;
  let res = await fetch(api);
  let data = await res.json();

  data.forEach(item => {
    productsList.innerHTML += ` <div class="card m-5" style="width: 18rem; heigth: 30rem">
    <img src=${item.img} class="card-img-top" alt="..." height="150">
    <div class="card-body">
    <h5 class="card-title">${item.name}</h5>
    <div class="d-flex ">
    <a href="#" class="like-btn" id="${item.id}">
    <img src="https://www.freeiconspng.com/thumbs/youtube-like-png/youtube-like-button-png-11.png" alt="" style="width: 30px; heigth: 20px" ></a>
    <h4 style="margin-left: 10px" id ="likes">${item.likes}</h4>
    </div>
    <button style="margin-top: 20px" class="btn btn-danger delete-btn" id="${item.id}">Delete</button>
    <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" style="margin-top: 20px; margin-left: 50px" class="btn btn-dark edit-btn" id="${item.id}">Edit</button>
 
    </div>
    </div>`;
  });
  activateDelete();
  activateEdit();
  activateLikes();
}
render();

async function deletionProcess(e) {
  let productId = e.target.id;

  await fetch(`${POSTS_API}/${productId}`, {
    method: "DELETE",
  });
  render();
}

async function postDataToInputs(e) {
  let productId = e.target.id;
  console.log(productId);
  let res = await fetch(`${POSTS_API}/${productId}`);
  let postData = await res.json();

  postname.value = postData.name;
  postlink.value = postData.img;

  applyChangesBtn.setAttribute("id", postData.id);
  applyChangesBtn.setAttribute("style", "display: flex");
  posting.setAttribute("style", "display:none !important");
  // checkApplies();
}

function activateDelete() {
  let deletePostBtn = document.querySelectorAll(".delete-btn");
  deletePostBtn.forEach(item => {
    item.addEventListener("click", deletionProcess);
  });
}
async function increaseLikes(e) {
  let productId = e.path[1].id;
  let res = await fetch(`${POSTS_API}/${productId}`);
  let postData = await res.json();
  console.log(productId);
  await fetch(`${POSTS_API}/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ likes: postData.likes + 1 }),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  render();
}

function activateLikes() {
  let likesBtn = document.querySelectorAll(".like-btn");
  likesBtn.forEach(item => {
    item.addEventListener("click", increaseLikes);
  });
}

// function checkApplies() {
//   let postbase = localStorage.getItem("post");
//   if (postbase) {
//     posting.parentNode.style.display("none");
//     survey.parentNode.style.display("none");
//     editing.parentNode.style.display("block");
//     applyChangesBtn.parentNode.style.di("block");
//   } else {
//     posting.setAttribute("style", "display:block");
//     survey.setAttribute("style", "display:block");
//     // editing.setAttribute("style", "display:none");
//     applyChangesBtn.setAttribute("style", "display: none");
//   }
// }
// checkApplies();

function activateEdit() {
  let editPostBtn = document.querySelectorAll(".edit-btn");
  editPostBtn.forEach(item => {
    item.addEventListener("click", postDataToInputs);
  });
  // checkApplies();
}

function dropdown_click() {
  applyChangesBtn.setAttribute("style", "display: none !important");
  posting.setAttribute("style", "display:flex ");
  console.log("h");
}

dropdown.addEventListener("click", dropdown_click);

async function applyChanges(e) {
  let newPostData = {
    id: e.target.id,
    name: postname.value,
    img: postlink.value,
    // likes: postlink.likes,
  };

  await fetch(`${POSTS_API}/${e.target.id}`, {
    method: "PATCH",
    body: JSON.stringify({ ...newPostData }),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  postname.value = "";
  postlink.value = "";
  applyChangesBtn.setAttribute("style", "display: none");
  posting.setAttribute("style", "display:flex !important");

  applyChangesBtn.removeAttribute("id");
  alert("Post has been edited");
  render();
}

applyChangesBtn.addEventListener("click", applyChanges);

let nextPage = document.querySelector("#next-page");
let prevPage = document.querySelector("#prev-page");
async function checkPages() {
  let res = await fetch(POSTS_API);
  let data = await res.json();
  let pages = Math.ceil(data.length / 5);

  if (currentPage === 1) {
    prevPage.style.display = "none";
    nextPage.style.display = "block";
  } else if (currentPage === pages) {
    prevPage.style.display = "block";
    nextPage.style.display = "none";
  } else {
    prevPage.style.display = "block";
    nextPage.style.display = "block";
  }
}
checkPages();

nextPage.addEventListener("click", () => {
  currentPage++;
  render();
  checkPages();
});

prevPage.addEventListener("click", () => {
  currentPage--;
  render();
  checkPages();
});

let searchInp = document.querySelector("#search-inp");
searchInp.addEventListener("input", () => {
  search = searchInp.value;
  currentPage = 1;
  render();
});
