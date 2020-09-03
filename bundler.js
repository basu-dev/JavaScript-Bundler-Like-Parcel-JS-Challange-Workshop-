#!user/bin/env node
const path = require("path");
const fs = require("fs");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const babel = require("babel-core");
const transFormToCommonJs = require("./transformToCommonJS");

let ID = 0;

function createTreeNode(fileName) {
  var dependencies = [];
  let file = fs.readFileSync(fileName, "utf-8");
  let ast = babylon.parse(file, {
    sourceType: "module",
  });
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });
  const id = ID++;
  const code = transFormToCommonJs(file);
  return {
    id,
    fileName,
    dependencies,
    code,
  };
}
let fileNames = [];
const createTree = (fileName) => {
  let tree = createTreeNode(fileName);
  fileNames.push(tree.fileName);
  const queue = [tree];
  for (let asset of queue) {
    asset.mapping = {};
    let dirname = path.dirname(asset.fileName);
    asset.dependencies.forEach((x) => {
      const absPath = path.join(dirname, x);
      if (fileNames.includes(absPath)) {
        let index = fileNames.indexOf(absPath);
        asset.mapping[x] = index;
        return;
      }
      const childTrerNode = createTreeNode(absPath);
      asset.mapping[x] = childTrerNode.id;
      queue.push(childTrerNode);
      fileNames.push(childTrerNode.fileName);
    });
  }
  return queue;
};
let tree = createTree("./src/main.js");
function bundle(tree) {
  let modules = "";
  tree.forEach((t) => {
    modules =
      modules +
      `${t.id}:[
            function(require,module,exports){
                ${t.code}
            },
            ${JSON.stringify(t.mapping)}
        ],`;
  });
  let result = `(function(modules){
       function require(id){
            let [fn,map]=modules[id];
            let module={exports:{}};
            let localRequire=function(relPath){
                return require(map[relPath])
            }
            fn(localRequire,module,module.exports);
            return module.exports 
        }
        require(0);
    })({${modules}})`;
  return result;
}
let result = bundle(tree);
try{
    fs.open("public/main.bundle.js", (s,e) => {
      let file = fs.readFileSync("public/main.bundle.js", "utf-8");
      if (file.toString() !== result) {
        fs.writeFileSync("public/main.bundle.js", result, "utf-8");
      }
    }
    );
}
catch(e){console.log("ac")}
fs.closeSync(2);
