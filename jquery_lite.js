/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);
	
	window.$l = function (arg) {
	  if (typeof arg === 'string') {
	    const element_list = document.querySelectorAll(arg);
	    let element_arr = Array.from(element_list);
	    let dnc = new DOMNodeCollection(element_arr);
	    return dnc;
	  } else if (arg instanceof HTMLElement) {
	    let element_arr = [];
	    element_arr.push(arg);
	    let dnc = new DOMNodeCollection(element_arr);
	    return dnc;
	  } else if (typeof arg === 'function') {
	    domReady(arg);
	  }
	};
	
	$l.extend = function(...args) {
	  args.slice(1).forEach(obj => {
	    Object.keys(obj).forEach(k => {
	      args[0][k] = obj[k];
	    });
	  });
	  return args[0];
	};
	
	$l.ajax = function(options) {
	  const defaults = {success: () => {}, error: () => {}, url: '', method: "GET", data: {}, contentType: 'application/x-www-form-urlencoded; charset=UTF-8'};
	  let ajax = $l.extend(options, defaults);
	  const xhr = new XMLHttpRequest();
	  xhr.open(ajax["method"], ajax["url"]);
	  xhr.onload = function (){
	    if (xhr.status === 200) {
	      ajax["success"]();
	    } else {
	      ajax["error"]();
	    }
	  };
	
	  const optionalData = ajax["data"];
	  xhr.send(optionalData);
	};
	
	var domReady = function(callback) {
	    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
	};
	
	window.$l(() => alert('document ready!'));


/***/ },
/* 1 */
/***/ function(module, exports) {

	function DOMNodeCollection (html_arr) {
	  this.html_arr = html_arr;
	}
	
	DOMNodeCollection.prototype.html = function (string) {
	  if (string) {
	    for (var i = 0; i < this.html_arr.length; i++) {
	      this.html_arr[i].innerHTML = string;
	    }
	  } else {
	    this.html_arr[0].innerHTML;
	  }
	};
	
	DOMNodeCollection.prototype.empty = function () {
	  for (var i = 0; i < this.html_arr.length; i++) {
	    this.html_arr[i].innerHTML = '';
	  }
	};
	
	DOMNodeCollection.prototype.append = function (el) {
	  if (el instanceof DOMNodeCollection) {
	    for (let i = 0; i < el.length; i++) {
	      for (let j = 0; j < this.html_arr.length; j++) {
	        this.html_arr[j].innerHTML += el[i].outerHTML;
	      }
	    }
	  } else {
	    for (let j = 0; j < this.html_arr.length; j++) {
	      this.html_arr[j].innerHTML += el;
	    }
	  }
	};
	
	DOMNodeCollection.prototype.attr = function (name, value) {
	  for (let j = 0; j < this.html_arr.length; j++) {
	    this.html_arr[j].removeAttribute(name);
	    this.html_arr[j].setAttribute(name, value);
	  }
	};
	
	DOMNodeCollection.prototype.addClass = function (value) {
	  for (let j = 0; j < this.html_arr.length; j++) {
	    this.html_arr[j].removeAttribute('class');
	    this.html_arr[j].setAttribute('class', value);
	  }
	};
	
	DOMNodeCollection.prototype.removeClass = function () {
	  for (let j = 0; j < this.html_arr.length; j++) {
	    this.html_arr[j].removeAttribute('class');
	  }
	};
	
	DOMNodeCollection.prototype.children = function () {
	  let offspring = [];
	  for (let j = 0; j < this.html_arr.length; j++) {
	    offspring = offspring.concat(this.html_arr[j].children);
	  }
	
	  offspring = remove_empty(offspring);
	
	  return new DOMNodeCollection(offspring);
	};
	
	DOMNodeCollection.prototype.parent = function () {
	  let parents = [];
	  for (let j = 0; j < this.html_arr.length; j++) {
	      if (!parents.includes(this.html_arr[j].parentNode)) {
	        parents.push(this.html_arr[j][0].parentNode);
	      }
	    }
	
	  return new DOMNodeCollection(parents);
	};
	
	DOMNodeCollection.prototype.find = function (selector) {
	  let selected = [];
	  for (let j = 0; j < this.html_arr.length; j++) {
	    if (this.html_arr[j].querySelectorAll(selector).length > 0) {
	      selected = selected.concat(this.html_arr[j].querySelectorAll(selector));
	    }
	  }
	  return new DOMNodeCollection(selected);
	};
	
	DOMNodeCollection.prototype.remove = function () {
	  this.empty();
	  this.html_arr = [];
	};
	
	DOMNodeCollection.prototype.on = function (action, callback) {
	
	  this.each(node => {
	    node.addEventListener(action, callback);
	    if (typeof node[action] === "undefined") {
	      node[action] = [];
	    }
	    node[action].push(callback);
	  });
	};
	
	DOMNodeCollection.prototype.off = function (action) {
	  this.each(node => {
	    if (node[action]) {
	      node[action].forEach(callback => {
	        node.removeEventListener(action, callback);
	      });
	    }
	    node[action] = [];
	  });
	};
	
	function remove_empty(collection) {
	  let removed = [];
	  for (var i = 0; i < collection.length; i++) {
	    if (collection[i].length !== 0) {
	      removed.push(collection[i]);
	    }
	  }
	  return removed;
	}
	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);
//# sourceMappingURL=jquery_lite.js.map