// [ Vaiables ]
// All foods
let types = null;
// Add
let isAdd = true;
let selectTypes = "";
const dropdownSelectList = [
  {
    name: "早餐(b)",
    selected: false,
  },
  {
    name: "菜餚(d)",
    selected: false,
  },
  {
    name: "甜點(de)",
    selected: false,
  },
  {
    name: "湯品(s)",
    selected: false,
  },
  {
    name: "飲料(dr)",
    selected: false,
  },
];
let dropdownSelect1 = "";
let showdropdown1 = false;
let dropdownSelect2 = "粥 / porridge";
let showdropdown2 = false;
// Get random food
let dropdownSelect3 = "早餐 Breakfast";
let showdropdown3 = false;
let showSelect = true;
// Food list
let activeType = null;

// [ Elements ]
// add
const addNode = document.getElementById("food-add");
const input1Node = document.getElementById("food-input1");
const input2Node = document.getElementById("food-input2");
const dropdownSelect1Node = document.getElementById("food-dropdown-select1");
const dropdownList1Node = document.getElementById("food-dropdown-list1");
const dropdownList1SpanNode = dropdownList1Node.getElementsByTagName("span");
const dropdownSelect2Node = document.getElementById("food-dropdown-select2");
const dropdownList2Node = document.getElementById("food-dropdown-list2");
// get
const getRandomNode = document.getElementById("food-get");
const dropdownSelect3Node = document.getElementById("food-dropdown-select3");
const dropdownList3Node = document.getElementById("food-dropdown-list3");
const getChooseNode = document.getElementById("food-get-choose");
const getResultNode = document.getElementById("food-get-result");
const getResultTypeNode = document.getElementById("food-get-result-type");
const getResultTextNode = document.getElementById("food-get-result-text");
// list
const typesNode = document
  .getElementById("food-types")
  .getElementsByTagName("a");
const listNode = document.getElementById("food-list-type");

// Trigger button click on Enter
document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    if (isAdd) {
      addToFile();
    } else {
      getRandom();
    }
  }
});

// [ Add ]
// Update isAdd - whether to show add foods block or get random meal block
const setIsAdd = (state) => {
  isAdd = state;

  if (isAdd) {
    addNode.style.display = "flex";
    getRandomNode.style.display = "none";
    input1Node.focus();
  } else {
    addNode.style.display = "none";
    getRandomNode.style.display = "block";
  }
};
// Call add endpoint
// input1: name, input2: link
async function addToFile() {
  let url = "http://localhost:3001/add?";

  // Input
  const input1 = input1Node.value;
  const input2 = input2Node.value;

  // Types
  let valueTypes = "";
  let selectTypes = dropdownSelect1.split(", ");
  selectTypes.forEach((item) => {
    valueTypes += valueTypes.length > 0 ? " " : "";
    valueTypes += item.slice(item.indexOf("(") + 1, item.indexOf(")"));
  });

  // File
  const valueFile = dropdownSelect2.split(" / ");

  // Hide types dropdown
  showdropdown1 = false;
  dropdownList1Node.style.display = "none";

  if (valueTypes.length === 0) {
    alert("請填寫類型 Please fill in types");
  } else {
    url +=
      `name=${input1}&` +
      `link=${input2 === "null" ? null : input2}&` +
      `types=${valueTypes}&` +
      `file=${valueFile[1]}`;

    await fetch(url, {
      method: "POST",
    })
      .then((res) => {
        if (res.status === 200) {
          alert(
            "成功添加! 你必須重啟API才能看見更新.\n" +
              "Successfully added! You must restart API to see the update."
          );
          resetAdd();
        } else if (res.status === 500) {
          return res.json();
        }
      })
      .then((resData) => {
        if (resData) {
          const chinese = resData.duplicate === "name" ? "菜名" : "連結";
          alert(
            "添加失敗: 重複的" +
              chinese +
              "\n" +
              "Cannot added: duplicate " +
              resData.duplicate
          );
        }
      })
      .catch((err) => console.error(err));
  }
}
// Reset add filds
const resetAdd = () => {
  // Input
  input1Node.value = "";
  input1Node.focus();
  // Types
  dropdownSelectList.forEach((item) => {
    item.selected = false;
  });
  dropdownSelect1 = "";
  dropdownSelect1Node.innerHTML = "";
  // File
  dropdownSelect2 = "粥 / porridge";
  dropdownSelect2Node.innerHTML = "粥 / porridge";
  showdropdown2 = false;
  dropdownList2Node.style.display = "none";
};

// [ Dropdown ]
// Toggle dropdown
const toggleDropdown = (type) => {
  let dropdown = null;
  let input = null;
  let selectNode = null;
  let listNode = null;
  if (type === 1) {
    showdropdown1 = !showdropdown1;
    dropdown = showdropdown1;
    input = dropdownSelect1;
    selectNode = dropdownSelect1Node;
    listNode = dropdownList1Node;
  } else if (type === 2) {
    showdropdown2 = !showdropdown2;
    dropdown = showdropdown2;
    input = dropdownSelect2;
    selectNode = dropdownSelect2Node;
    listNode = dropdownList2Node;
  } else {
    showdropdown3 = !showdropdown3;
    dropdown = showdropdown3;
    input = dropdownSelect3;
    selectNode = dropdownSelect3Node;
    listNode = dropdownList3Node;
  }

  if (dropdown) {
    selectNode.innerHTML = `${input} &#9650;`;
    listNode.style.display = "flex";
  } else {
    selectNode.innerHTML = `${input} &#9660;`;
    listNode.style.display = "none";
  }
};
const setDropdown = (type, dropdown, index) => {
  if (dropdown === 1) {
    dropdownSelect1 = "";
    dropdownSelectList[index].selected = !dropdownSelectList[index].selected;
    for (let i = 0; i < dropdownSelectList.length; i++) {
      if (dropdownSelectList[i].selected) {
        dropdownSelect1 += dropdownSelect1.length > 0 ? ", " : "";
        dropdownSelect1 += dropdownSelectList[i].name;
        dropdownList1SpanNode[i].innerHTML = "&#x2713;";
      } else {
        dropdownList1SpanNode[i].innerHTML = "";
      }
    }
    dropdownSelect1Node.innerHTML = `${dropdownSelect1} &#9650;`;
    setActiveType(index);
  } else if (dropdown === 2) {
    dropdownSelect2 = type;
    toggleDropdown(dropdown);
  } else {
    dropdownSelect3 = type;
    setActiveType(index);
    toggleDropdown(dropdown);
  }
};

// [ Random result ]
const getRandom = () => {
  const list = [];

  // Get types index
  for (let i = 0; i < types.length; i++) {
    if (types[i].name === dropdownSelect3.split(" ")[0]) {
      curType = types[i];
      break;
    }
  }

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
    getResultTextNode.onmouseover = () => {
      getResultTextNode.style.backgroundColor = "var(--black-8)";
    };
    getResultTextNode.onmouseout = () => {
      getResultTextNode.style.backgroundColor = "var(--black-5)";
    };
    getResultTextNode.style.cursor = "pointer";
  } else {
    getResultTextNode.onclick = () => {};
    getResultTextNode.style.cursor = "auto";
    getResultTextNode.onmouseover = () => {};
    getResultTextNode.onmouseout = () => {};
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
    getResultTypeNode.innerHTML = dropdownSelect3 + ":";
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
    const { name, type, data } = listType[i];

    // Container
    const container = document.createElement("div");
    container.className = "flex-column v-center";

    // Title
    const title = document.createElement("a");
    let engType = type;
    for (let j = 0; j < engType.length; j++) {
      if (j === 0) {
        engType = engType[0].toUpperCase() + engType.slice(1);
      } else if (engType[j].toUpperCase() === engType[j]) {
        engType = engType.slice(0, j) + " " + engType.slice(j);
        j++;
      }
    }
    title.innerHTML = `${name} ${engType} (${data.length})`;
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
input1Node.focus();
