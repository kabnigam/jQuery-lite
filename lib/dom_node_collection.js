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
