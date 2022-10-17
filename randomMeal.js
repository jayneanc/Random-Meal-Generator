let types = null;
let isAdd = true;
let activeType = null;
let showdropdown = false;
let dropdownSelect = "早餐";
let showSelect = true;

// [ Elements ]
// add
const addNode = document.getElementById("food-add");
// get
const getRandomNode = document.getElementById("food-get");
const dropdownSelectNode = document.getElementById("food-dropdown-select");
const dropdownListNode = document.getElementById("food-dropdown-list");
const getChooseNode = document.getElementById("food-get-choose");
const getResultNode = document.getElementById("food-get-result");
const getResultTextNode = document.getElementById("food-get-result-text");
// list
const typesNode = document
  .getElementById("food-types")
  .getElementsByTagName("a");
const listNode = document.getElementById("food-list-type");

// [ Add ]
// Update isAdd - whether to show add foods block or get random meal block
const setIsAdd = (state) => {
  isAdd = state;

  if (isAdd) {
    addNode.style.display = "flex";
    getRandomNode.style.display = "none";
  } else {
    addNode.style.display = "none";
    getRandomNode.style.display = "flex";
  }
};

// [ Dropdown ]
// Toggle dropdown
const toggleDropdown = () => {
  showdropdown = !showdropdown;

  if (showdropdown) {
    dropdownSelectNode.innerHTML = `${dropdownSelect} &#9650;`;
    dropdownListNode.style.display = "flex";
  } else {
    dropdownSelectNode.innerHTML = `${dropdownSelect} &#9660;`;
    dropdownListNode.style.display = "none";
  }
};
const setDropdown = (type, index) => {
  dropdownSelect = type;
  toggleDropdown();
  setActiveType(index);
};

// [ Random result ]
const getRandom = () => {
  const curType = types[activeType];
  const list = [];

  // Get list of names
  if (curType.list) {
    for (let i = 0; i < curType.list.length; i++) {
      curType.list[i].data.forEach((item) => {
        list.push(item);
      });
    }
  } else {
    curType.data.forEach((item) => {
      list.push(item);
    });
  }

  // Get random name from the list
  const index = Math.floor(Math.random() * list.length);
  getResultTextNode.innerHTML = list[index].name;
  if (list[index].link) {
    getResultTextNode.onclick = () => {
      window.open(list[index].link, "_blank");
    };
    getResultTextNode.style.cursor = "pointer";
  }
  else {
    getResultTextNode.onclick = () => {};
    getResultTextNode.style.cursor = "auto";
  }

  // Toggle random block
  toggleRandomBlock(false);
};

// [ Toggle random blocks ]
const toggleRandomBlock = (state) => {
  showSelect = state;

  if (showSelect) {
    getChooseNode.style.display = "flex";
    getResultNode.style.display = "none";
  } else {
    getChooseNode.style.display = "none";
    getResultNode.style.display = "flex";
  }
};

// [ All foods list ]
// Update active type
const setActiveType = (index) => {
  activeType = index;

  for (let i = 0; i < typesNode.length; i++) {
    if (i === activeType) {
      typesNode[i].style.opacity = 1;
      typesNode[i].style.fontWeight = 900;
    } else {
      typesNode[i].style.opacity = 0.8;
      typesNode[i].style.fontWeight = "normal";
    }
  }
  getFoodList();
};

// Get food list
async function getFoodList() {
  await fetchData();

  // Clear all child nodes
  while (listNode.firstChild) {
    listNode.removeChild(listNode.firstChild);
  }

  // Generate list
  let listType = types[activeType].list;
  if (!listType) {
    listType = [{ name: "全部", type: "all", data: types[activeType].data }];
    listNode.className = "flex h-center";
  } else {
    listNode.className = "flex h-between";
  }

  for (let i = 0; i < listType.length; i++) {
    const { name, data } = listType[i];

    // Container
    const container = document.createElement("div");
    container.className = "flex-column v-center";

    // Title
    const title = document.createElement("a");
    title.innerHTML = `${name} (${data.length})`;
    title.style.opacity = 0.7;
    container.appendChild(title);

    // Content
    const content = document.createElement("div");
    content.className = "flex-column v-center content";
    container.appendChild(content);
    data.forEach((item) => {
      const food = document.createElement("a");
      food.innerHTML = item.name;
      if (item.link) {
        food.onclick = () => {
          window.open(item.link, "_blank");
        };
        food.onmouseover = () => {
          food.style.textDecoration = "underline";
          food.style.color = "var(--active)";
          food.style.cursor = "pointer";
        };
        food.onmouseout = () => {
          food.style.textDecoration = "none";
          food.style.color = "var(--white)";
          food.style.cursor = "auto";
        };
      }
      content.appendChild(food);
    });
    listNode.appendChild(container);
  }
}

// [ API ]
// Fetch data
async function fetchData() {
  await fetch(`http://localhost:3001/`)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((resData) => {
      if (resData) {
        types = resData.data;
      }
    })
    .catch((err) => console.error(err));
}

setActiveType(0);
