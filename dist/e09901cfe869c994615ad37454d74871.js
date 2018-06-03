// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({8:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = proxy;
function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    configurable: true,
    set: function set(newVal) {
      target[sourceKey][key] = newVal;
    },
    get: function get() {
      return target[sourceKey][key];
    }
  });
}
},{}],18:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.pushTarget = pushTarget;
exports.popTarget = popTarget;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dep = function () {
  function Dep() {
    _classCallCheck(this, Dep);

    this.sub = [];
  }

  _createClass(Dep, [{
    key: "addDepend",
    value: function addDepend() {
      Dep.target.addDep(this);
    }
  }, {
    key: "addSub",
    value: function addSub(sub) {
      this.sub.push(sub);
    }
  }, {
    key: "notify",
    value: function notify() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.sub[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var sub = _step.value;

          sub.update();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return Dep;
}();

exports.default = Dep;


Dep.target = null;
var targetStack = [];

function pushTarget(_target) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = _target;
}

function popTarget() {
  Dep.target = targetStack.pop();
}
},{}],20:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = observer;

var _dep = require('./dep');

var _dep2 = _interopRequireDefault(_dep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Observer = function () {
  function Observer(value) {
    _classCallCheck(this, Observer);

    this.walk(value);
  }

  _createClass(Observer, [{
    key: 'walk',
    value: function walk(obj) {
      var _this = this;

      Object.keys(obj).forEach(function (key) {
        if (_typeof(obj[key]) === 'object') {
          _this.walk(obj[key]);
        }
        defineReactive(obj, key, obj[key]);
      });
    }
  }]);

  return Observer;
}();

var defineReactive = function defineReactive(obj, key, value) {
  var dep = new _dep2.default(); //实例化一个依赖收集器
  Object.defineProperty(obj, key, {
    set: function set(newVal) {
      if (newVal === value) return;
      value = newVal;
      dep.notify(); //通知依赖更新数据
    },
    get: function get() {
      if (_dep2.default.target) dep.addDepend(); //添加依赖收集
      return value;
    }
  });
};

function observer(value) {
  if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') return;
  return new Observer(value);
}
},{"./dep":18}],14:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initOptions;

var _observer = require('../observer');

var _observer2 = _interopRequireDefault(_observer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LIFECYCLE_HOOKS = ['created', 'mounted'];

function initOptions(vm) {
  vm._data = vm.$options.data;
  (0, _observer2.default)(vm._data);
  LIFECYCLE_HOOKS.forEach(function (hook) {
    vm.$options[hook] = vm.$options[hook] || function () {};
  });
}
},{"../observer":20}],16:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var compiler = function () {
  function compiler(el, vm) {
    _classCallCheck(this, compiler);

    vm.$el = document.querySelector(el);
    var fragment = document.createDocumentFragment();
    this.replace(vm.$el, vm);
  }

  _createClass(compiler, [{
    key: 'replace',
    value: function replace(frag, vm) {
      var _this = this;

      Array.from(frag.childNodes).forEach(function (node) {
        var txt = node.textContent;
        var reg = /\{\{(.*?)\}\}/; // 正则匹配{{}}

        if (node.nodeType === 3 && reg.test(txt)) {
          var arr = RegExp.$1.split('.');
          var val = vm;
          arr.forEach(function (key) {
            val = val[key];
          });
          node.textContent = txt.replace(reg, val).trim();
          vm.$watch(RegExp.$1, function (newVal) {
            node.textContent = txt.replace(reg, newVal).trim();
          });
        }

        if (node.nodeType === 1) {
          var nodeAttr = node.attributes;
          Array.from(nodeAttr).forEach(function (attr) {
            var name = attr.name;
            //判断是否是v-model,然后做绑定数据处理
            if (name === 'v-model') {
              var exp = attr.value;
              var _arr = exp.split('.');
              //input初始化赋值
              var value = vm;
              _arr.forEach(function (key, index) {
                value = value[key];
              });
              node.value = value;
              //添加监听数据值变化
              vm.$watch(exp, function (newVal) {
                node.value = newVal;
              });
              //添加事件监听input值变化
              node.addEventListener('input', function (e) {
                var newVal = e.target.value;
                var val = vm;
                _arr.forEach(function (key, index) {
                  if (index === _arr.length - 1) {
                    val[key] = newVal;
                    return;
                  }
                  val = val[key];
                });
              });
            }
          });
        }

        if (node.childNodes && node.childNodes.length) {
          _this.replace(node, vm);
        }
      });
    }
  }]);

  return compiler;
}();

exports.default = compiler;
},{}],10:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dep = require('./dep');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Watcher = function () {
  function Watcher(vm, expression, callBack) {
    _classCallCheck(this, Watcher);

    this.vm = vm;
    this.callBack = callBack;
    this.expression = expression;
    this.value = this.getVal();
  }

  _createClass(Watcher, [{
    key: 'getVal',
    value: function getVal() {
      (0, _dep.pushTarget)(this);
      var val = this.vm;
      this.expression.split('.').forEach(function (key) {
        val = val[key];
      });
      (0, _dep.popTarget)();
      return val;
    }
  }, {
    key: 'addDep',
    value: function addDep(dep) {
      dep.addSub(this);
    }
  }, {
    key: 'update',
    value: function update() {
      var val = this.vm;
      this.expression.split('.').forEach(function (key) {
        val = val[key];
      });
      this.callBack.call(this.vm, val);
    }
  }]);

  return Watcher;
}();

exports.default = Watcher;
},{"./dep":18}],12:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callHook = callHook;
function callHook(vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) handlers.call(vm);
}
},{}],6:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _proxy = require('./instance/proxy');

var _proxy2 = _interopRequireDefault(_proxy);

var _init = require('./instance/init');

var _init2 = _interopRequireDefault(_init);

var _compile = require('./compile');

var _compile2 = _interopRequireDefault(_compile);

var _watcher = require('./observer/watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _lifecycle = require('./instance/lifecycle');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MVVM = function MVVM() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, MVVM);

  var vm = this;
  vm.$options = options;
  vm.$watch = function (key, callBack) {
    new _watcher2.default(vm, key, callBack);
  };
  (0, _init2.default)(vm);
  for (var key in vm._data) {
    (0, _proxy2.default)(vm, '_data', key);
  }
  (0, _lifecycle.callHook)(vm, 'created');
  new _compile2.default(vm.$options.el, vm);
  (0, _lifecycle.callHook)(vm, 'mounted');
};

exports.default = MVVM;
},{"./instance/proxy":8,"./instance/init":14,"./compile":16,"./observer/watcher":10,"./instance/lifecycle":12}],4:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./core/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (window) {
  window.MVVM = _index2.default;
}

exports.default = _index2.default;
},{"./core/index":6}],24:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = undefined || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '52053' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[24,4])
//# sourceMappingURL=/dist/e09901cfe869c994615ad37454d74871.map