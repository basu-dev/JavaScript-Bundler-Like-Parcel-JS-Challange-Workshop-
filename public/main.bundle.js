(function(modules){
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
    })({0:[
            function(require,module,exports){
                function _interopRequireDefault(obj){
	return obj && obj.__esModule? obj :{default : obj};}
var _Messsage = require("./message.js");
            var Messsage = _interopRequireDefault(_Messsage)
        
console.log(Messsage.default);  
            },
            {"./message.js":1}
        ],1:[
            function(require,module,exports){
                function _interopRequireDefault(obj){
	return obj && obj.__esModule? obj :{default : obj};}
var _name = require("./name.js");
            var name = _interopRequireDefault(_name)
        
console.log(JSON.stringify(name));
//  const Message =`Hello ${name.default}`;
exports.Message="Hello "+name.default.default
            },
            {"./name.js":2}
        ],2:[
            function(require,module,exports){
                let name="basu";
exports.default=name
            },
            {}
        ],})