function transFormToCommonJs(file) {
  let results = [];
  function transform() {
    let reg = /import (.+) from "(.+)"/g;
    let [, name, fN] = reg.exec(file);
    results.push([name, fN]);
    file = file.replace(
      /import (.+) from (.+)/,
      `var _${name} = require("${fN}");
            var ${name} = _interopRequireDefault(_${name})
        `
    );
    // let regex=new RegExp(`^${name}$`,'m')
    let regex = /([^\/ | _])abc/m;


    try {
      const [, place] = regex.exec(file);
      file = file.replace(regex, `${place}${name}.default`);
    } catch (e) {}

    if (file.includes("import")) {
      transform(file);
    }
  }
  if (file.includes("import")) {
    file = file.replace(
      "",
      `function _interopRequireDefault(obj){\n\treturn obj && obj.__esModule? obj :{default : obj};}\n`
    );

    transform();
  }

  return file;
}
module.exports = transFormToCommonJs;
