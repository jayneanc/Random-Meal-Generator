const fs = require("fs");

// Files
const files = [
  "files/beef.txt",
  "files/chicken.txt",
  "files/cold.txt",
  "files/drink.txt",
  "files/egg.txt",
  "files/lamb.txt",
  "files/noodle.txt",
  "files/others.txt",
  "files/pork.txt",
  "files/porridge.txt",
  "files/riceBall.txt",
  "files/seafood.txt",
  "files/soup.txt",
  "files/toast.txt",
  "files/veggies.txt",
];

// Types of food
const types = [
  {
    name: "早餐",
    type: "breakfast",
    list: [
      { name: "蛋類", type: "egg", data: [] },
      { name: "粥類", type: "porridge", data: [] },
      { name: "飯糰", type: "riceBall", data: [] },
      { name: "吐司", type: "toast", data: [] },
      { name: "其他", type: "others", data: [] },
    ],
  },
  {
    name: "菜餚",
    type: "dishes",
    list: [
      { name: "蛋類", type: "egg", data: [] },
      { name: "雞", type: "chicken", data: [] },
      { name: "牛", type: "beef", data: [] },
      { name: "豬", type: "pork", data: [] },
      { name: "羊", type: "lamb", data: [] },
      { name: "海鮮", type: "seafood", data: [] },
      { name: "蔬菜", type: "veggies", data: [] },
      { name: "涼拌", type: "cold", data: [] },
      { name: "麵", type: "noodle", data: [] },
      { name: "其他", type: "others", data: [] },
    ],
  },
  { name: "甜點", type: "dessert", data: [] },
  { name: "湯品", type: "soup", data: [] },
  { name: "飲料", type: "drink", data: [] },
];

// Read files
const readFile = () => {
  for (const filename of files) {
    const contents = fs.readFileSync(filename, "utf-8");
    const contentArray = contents.split(/\r?\n/);

    // Skip if file empty
    if (contentArray[0] === "") {
      continue;
    }

    // Get file type
    let fileType = filename.split("/")[1];
    fileType = fileType.replace(".txt", "");

    for (const line of contentArray) {
      const column = line.split(", ");

      // Type
      let type = column[1];
      type = type.split(" ");

      // Detail
      const detail = {
        name: column[0],
        link: column[2] !== "null" ? column[2] : null,
      };

      // Insert into types
      type.forEach((elmnt) => {
        // Type of food index
        let typeIdx = null;
        if (elmnt === "b") {
          typeIdx = 0;
        } else if (elmnt === "d") {
          typeIdx = 1;
        } else if (elmnt === "de") {
          typeIdx = 2;
        } else if (elmnt === "s") {
          typeIdx = 3;
        } else if (elmnt === "dr") {
          typeIdx = 4;
        } else {
          console.log("Wrong type: ", column);
        }

        // Insert into list
        const list = types[typeIdx].list;
        if (!list) {
          types[typeIdx].data.push(detail);
        } else {
          list.forEach((item) => {
            if (item.type === fileType) {
              item.data.push(detail);
            }
          });
        }
      });
    }
  }
};

// Add to file
const writeFile = (req, res) => {
  // Query
  const { name, link, types, file } = req.query;

  // Read file first to make sure there is no duplicate item
  const contents = fs.readFileSync(`files/${file}.txt`, "utf-8");
  const contentArray = contents.split(/\r?\n/);
  let newContent = contents;
  let duplicate = null;
  if (contentArray[0] !== "") {
    for (const line of contentArray) {
      const column = line.split(", ");
      if (name === column[0]) {
        duplicate = "name";
        break;
      }

      if (link === column[2]) {
        duplicate = "link";
        break;
      }
    }
    newContent += `\n${name}, ${types}, ${link}`;
  } else {
    newContent = `${name}, ${types}, ${link}`;
  }

  // No duplicattion
  if (duplicate) {
    res.status(500).send({ duplicate });
  } else {
    fs.writeFile(`files/${file}.txt`, newContent, (err) => {
      if (err) {
        console.error(err);
      }
    });
    res.status(200).send();
  }
};

exports.meals = {
  types,
  readFile,
  writeFile,
};
