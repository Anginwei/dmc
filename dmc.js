/*
 * 一个简易的JS库，API与结构大部分仿照JQuery
 * 仅作为学习研究之用
 * author Anginwei
 * date 11-9-2014
 */
(function(window) {
	var dmc = (function() {

		var dmc = function(selector, context) {
			return new _dmc.fn.init(selector, context);
		}

		function _dmc() {}
			// 为_dmc.prototype取别名，方便编码
		_dmc.fn = _dmc.prototype = {
			constructor: _dmc,

			/*
			 * 初始化dmc对象
			 * 参数 选择器 上下文环境
			 */
			init: function(selector, context) {
				this.context = context || document;
				// 选择器过滤
				if (!selector) {
					this.context = [];
				} else if (selector.nodeType === 1) { // 传入元素
					this.context = [selector];
				} else if (selector instanceof Array) { // 传入元素集合
					this.context = selector;
				} else if (dmc.type(selector, "object") && selector.hasOwnProperty("context") &&
					dmc.instance(selector.context, Array)) { // 传入dmc对象本身，仅作拷贝
					this.context = selector.context;
				} else {
					this.context = mini(selector, context);
				}
				this.length = this.context.length;
				for (var i = 0; i < this.length; i++) {
					this[i] = this.context[i];
				}
				return this;
			},

			/*
			 * 获取结果集中的元素
			 * 返回 dom元素
			 */
			get: function(index) {
				return this.context[index];
			},

			/*
			 * 获取包含指定结果集合的dmc对象
			 */
			eq: function(index) {
				return dmc(this.get(index));
			},

			/*
			 * 返回匹配元素列表
			 */
			list: function() {
			    // 返回拷贝，防止引用
				return this.context.slice(0);
			},

			/*
			 * 返回匹配元素的数量
			 */
			length: function() {
				return this.context.length;
			},

			/*
			 * 对结果集中的每个元素调用指定函数
			 */
			each: function(fn) {
				if (dmc.isFunction(fn)) {
					this.context.forEach(function(element, index) {
						fn.call(element, index, element);
					});
				}
				return this;
			},

			/*
			 * 如果只有一个参数，则返回匹配集合中第一个元素对应
			 * 的css值，如果有两个参数，则对匹配集合中所有元素设置相应值
			 * 可以只传入一个包含名值对的对象
			 */
			css: function(name, value) {
				var length = arguments.length;
				if (!this.length) {
					return this;
				}
				switch (length) {
					case 0:
						dmc.error("css参数不能为空");
						break;
					case 1:
						switch (dmc.type(name)) {
							case "string":
								name == "float" &&
									(name = this.context[0].style.cssFloat !== undefined ? "cssFloat" : "styleFloat");
								return this.context[0].currentStyle ? this.context[0].currentStyle[name] :
									window.getComputedStyle(this.context[0], null)[name];
								break;
							case "object":
								for (var property in name) {
									this.css(property, name[property]);
								}
								break;
							default:
								break;
						}
						break;
					default:
						if (dmc.type(name, "string")) {
							name == "float" &&
								(name = this.context[0].style.cssFloat !== undefined ? "cssFloat" : "styleFloat");
							value += ((Number(value) || value == 0) ? "px" : "");
							this.context.forEach(function(element) {
								element.style[name] = value;
							});
						}
						break;
				}
				return this;
			},

			/*
			 * 存储数据用，运作模式同css
			 */
			data: function(name, value) {
				var length = arguments.length;
				switch (length) {
					case 0:
						dmc.error("data参数不能为空");
						break;
					case 1:
						switch (dmc.type(name)) {
							case "string":
								return this.length === 0 || !this.context[0]._data ? null :
									this.context[0]._data[name];
								break;
							case "object":
								for (var property in name) {
									this.data(property, name[property]);
								}
								break;
							default:
								break;
						}
						break;
					default:
						this.context.forEach(function(element) {
							element._data = element._data || {};
							element._data[name] = value;
						});
						break;
				}
				return this;
			},

			/*
			 * 如果value为空，则返回匹配元素中第一个元素innerHTML的值
			 * value不为空，则设置匹配元素中所有元素innerHTML的值为value
			 */
			html: function(value) {
				if (dmc.isUndefined(value)) {
					return this.length ? this.context[0].innerHTML : "";
				} else {
					this.context.forEach(function(element) {
						element.innerHTML = value;
					});
				}
				return this;
			},

			/*
			 * 同html，只是不读取标签内容
			 * 写模式与html完全相同
			 */
			text: function(value) {
				if (dmc.isUndefined(value)) {
					return this.length ? this.context[0].innerHTML.replace(/\<.*?\>/g, "") : "";
				} else {
					this.context.forEach(function(element) {
						element.innerHTML = value;
					});
				}
				return this;
			},

			/*
			 * 运行模式同css方法
			 */
			attr: function(name, value) {
				var length = arguments.length;
				if (!this.length) {
					return this;
				}
				switch (length) {
					case 0:
						dmc.error("attr参数不能为空");
						break;
					case 1:
						switch (dmc.type(name)) {
							case "string":
								return this.context[0].getAttribute(name) || undefined;
								break;
							case "object":
								for (var property in name) {
									this.attr(property, name[property]);
								}
								break;
							default:
								break;
						}
						break;
					default:
						if (dmc.type(name, "string")) {
							this.context.forEach(function(element) {
								element.setAttribute(name, value);
							});
						}
						break;
				}
				return this;
			},

			/*
			 * 移除匹配元素中指定name的属性，多个属性用空格隔开
			 */
			removeAttr: function(name) {
				if (dmc.type(name, "string")) {
					var list = name.trim().split(/\s+/);
					this.context.forEach(function(element) {
						list.forEach(function(attr) {
							element.removeAttribute(attr);
						});
					});
				}
				return this;
			},

			/*
			 * 为匹配元素添加类，多个类名用空格隔开
			 */
			addClass: function(name) {
				if (dmc.type(name, "string")) {
					var list = name.trim().split(/\s+/);
					this.context.forEach(function(element) {
						list.forEach(function(cln) {
							dmc.Ability.classList ?
								element.classList.add(cln) :
								element.className += ($(element).hasClass(cln) ? "" : " " + cln);
						});
					});
				}
				return this;
			},

			/*
			 * 为匹配元素删除类，多个类名用空格隔开
			 */
			removeClass: function(name) {
				if (dmc.type(name, "string")) {
					var list = name.trim().split(/\s+/),
						classNames;
					this.context.forEach(function(element) {
						list.forEach(function(cln) {
							if (dmc.Ability.classList) { // 有原生用原生
								element.classList.remove(cln);
							} else { // 处理className字符串
								classNames = element.className.trim().split(/\s+/);
								classNames.forEach(function(ecln, index) {
									if (ecln === cln) {
										classNames[index] = "";
									}
								});
								element.className = classNames.join(" ");
							}
						});
						if (!element.className) {
							$(element).removeAttr("class");
						}
					});
				}
				return this;
			},

			/*
			 * 为匹配元素添加或删除类，多个类名用空格隔开
			 */
			toggleClass: function(name) {
				if (dmc.type(name, "string")) {
					var list = name.trim().split(/\s+/),
						elem;
					this.context.forEach(function(element) {
						list.forEach(function(cln) {
							if (dmc.Ability.classList) {
								element.classList.toggle(cln);
							} else {
								elem = $(element);
								elem.hasClass(cln) ? elem.removeClass(cln) : elem.addClass(cln);
							}
						});
					});
				}
				return this;
			},

			/*
			 * 所有匹配元素都通过包含测试，方法才返回true
			 */
			hasClass: function(name) {
				if (dmc.type(name, "string")) {
					var classNames, flag = true;
					this.context.forEach(function(element) {
						flag = flag === true && element.className.indexOf(name) !== -1;
					});
					return flag;
				}
				dmc.error("hasClass参数类型错误");
			},

			/*
			 * 返回匹配集合中第一个元素的value
			 * 或为每个匹配元素设置value
			 * 主要用于表单控件
			 */
			value: function(value) {
				if (dmc.isUndefined(value)) {
					if (this.length) {
						return this.content[0].value;
					}
				} else {
					this.context.forEach(function(element) {
						element.value = value;
					})
				}
				return this;
			},

			/*
			 * 对匹配元素后方插入内容
			 * 内容可以为dmc对象，字符串，元素
			 * 若为dmc对象，则将对象中所有元素插入
			 */
			append: function(content) {
				if (!dmc.isUndefined(content)) {
					this.context.forEach(function(element) {
						switch (dmc.type(content)) {
							case "string":
								element.innerHTML += content;
								break;
							case "object":
								if (content.nodeType == 1) { // 传入元素
									element.appendChild(content);
								} else if (content.context && content.length) { // 传入的是dmc对象
									content.context.forEach(function(elemAppend) {
										element.appendChild(elemAppend);
									});
								}
								break;
							default:
								break;
						}
					});
				}
				return this;
			},

			show: function() {
				var status;
				this.context.forEach(function(element) {
					if ($(element).css("display") == "none") {
						status = $(element).data("displayState") || "block";
						$(element).css("display", status);
					}
				});
				return this;
			},

			hide: function() {
				this.context.forEach(function(element) {
					$this = $(element);
					if ($this.css("display") != "none") {
						$this.data("displayState", $this.css("display")).css("display", "none");
					}
				});
				return this;
			},

			/*
			 * 对匹配元素添加包裹标签
			 */
			wrap: function(tagName) {
				if (dmc.type(tagName, "string")) {
					this.context.forEach(function(element) {
						element.outerHTML =
							"<" + tagName + ">" + element.outerHTML + "</" + tagName + ">";
					});
				}
				return this;
			},

			/*
			 * 在匹配元素之后插入内容，可以指定位置
			 * 当pos为in时，于*位置插入内容
			 * 当pos为out时，于^位置插入内容
			 * eg.  ^<p>*test</p>
			 * 参数 插入的内容，[位置](只能为 "in" 或 "out"，默认"in")
			 */
			before: function(content, pos) {
				pos = !dmc.isUndefined(content) && pos || "in";
				if (dmc.type(content, "string") && /\b(in|out)\b/.test(pos)) {
					this.context.forEach(function(element) {
						/in/.test(pos) ?
							(element.innerHTML = content + element.innerHTML) :
							(element.outerHTML = content + element.outerHTML);
					});
				}
				return this;
			},

			/*
			 * 在匹配元素之后插入内容，可以指定位置
			 * 当pos为in时，于*位置插入内容
			 * 当pos为out时，于^位置插入内容
			 * eg.  <p>test*</p>^
			 * 参数 插入的内容，[位置](只能为 "in" 或 "out"，默认"in")
			 */
			after: function(content, pos) {
				pos = !dmc.isUndefined(content) && pos || "in";
				if (dmc.type(content, "string") && /\b(in|out)\b/.test(pos)) {
					this.context.forEach(function(element) {
						/in/.test(pos) ?
							(element.innerHTML += content) :
							(element.outerHTML += content);
					});
				}
				return this;
			},

			/*
			 * 为匹配元素绑定事件
			 * 参数 事件类型，处理函数
			 */
			bind: function(type, fn) {
				if (dmc.type(type, "string") && dmc.isFunction(fn)) {
					this.context.forEach(function(element) {
						dmc.Event.add(element, type, fn);
					});
				}
				return this;
			},

			/*
			 * 单击事件
			 */
			click: function(fn) {
				return this.bind("click", fn);
			},

			/*
			 * 扩展dmc原型
			 * 参数 扩展对象，[覆盖]，[深拷贝]
			 * 返回 dmc对象
			 */
			extend: function(source, overwrite) {
				return dmc.extend(source, _dmc.fn, overwrite);
			}
		}; // end of _dmc.prototype
		// 使new _dmc.prototype.init()指向正确
		dmc.fn = _dmc.prototype.init.prototype = _dmc.fn;
		dmc.version = "1.0";

		/*
		 * 扩展目标对象，overwrite为true则覆盖原目标中的同名属性，deep为ture则深拷贝
		 * overwrite,deep默认为true，目标对象默认为dmc全局对象
		 * 参数 扩展对象，[目标对象]，[覆盖]
		 * 返回 目标对象
		 */
		dmc.extend = function(source, target, overwrite) {
			overwrite = overwrite === undefined && true;
			target = arguments[1] || this;
			if (typeof source === "object" && !(source instanceof Array)) {
				for (var property in source) {
					var copy = source[property];
					if (overwrite || !(property in target)) {
						if (typeof copy === "object") {
							target[property] = arguments.callee(target[property] || {}, copy);
						} else {
							target[property] = copy;
						}
					}
				}
			}
			return target;
		};

		/*
		 * 浏览器特性
		 */
		dmc.Ability = (function(body) {
			return {
				xhr: !!window.XMLHttpRequest,
				selector: !!body.querySelector,
				classList: !!body.classList,
				attachEvent: !!body.attachEvent,
				dom2Event: !!body.addEventListener,
				dataset: !!body.dataset
			};
		})(window.document.body);

		/*
		 * 跨浏览器事件对象
		 */
		dmc.Event = {
			add: (function() {
				if (dmc.Ability.dom2Event) {
					return function(element, type, handler) {
						if (dmc.type(element, "object") &&
							dmc.type(type, "string") && dmc.isFunction(handler)) {
							element.addEventListener(type, handler, false);
						}
					}
				}
				if (dmc.Ability.attachEvent) {
					return function(element, type, handler) {
						if (dmc.type(element, "object") &&
							dmc.type(type, "string") && dmc.isFunction(handler)) {
							element.attachEvent("on" + type, handler);
						}
					}
				}
				return function(element, type, handler) {
					if (dmc.type(element, "object") &&
						dmc.type(type, "string") && dmc.isFunction(handler)) {
						element["on" + type] = handler;
					}
				}
			})(),
			remove: (function() {
				if (dmc.Ability.dom2Event) {
					return function(element, type, handler) {
						if (dmc.type(element, "object") &&
							dmc.type(type, "string") && dmc.isFunction(handler)) {
							element.removeEventListener(type, handler, false);
						}
					}
				}
				if (dmc.Ability.attachEvent) {
					return function(element, type, handler) {
						if (dmc.type(element, "object") &&
							dmc.type(type, "string") && dmc.isFunction(handler)) {
							element.detachEvent("on" + type, handler);
						}
					}
				}
				return function(element, type, handler) {
					if (dmc.type(element, "object") &&
						dmc.type(type, "string") && dmc.isFunction(handler)) {
						element["on" + type] = null;
					}
				}
			})(),
			get: function() {
				return dmc.Ability.dom2Event ?
					event : window.event;
			},
			target: function() {
				var obj = this.get();
				return obj.target || obj.srcElement;
			},
			preventDefault: function() {
				var obj = this.get();
				obj.preventDefault ?
					obj.preventDefault() : obj.returnValue = false;
			},
			stopPropagation: function() {
				var obj = this.get();
				obj.stopPropagation ?
					obj.stopPropagation() : obj.cancelBubble = true;
			}
		}; // end of Event

		/*
		 * Ajax相关
		 */
		dmc.Ajax = {

			/*
			 * 创建XMLHttpRequest对象
			 */
			createXHR: (function() {
				if (dmc.Ability.xhr) {
					return function() {
						return new XMLHttpRequest();
					};
				} else {
					return function() {
						return new ActiveXObject("Microsoft.XMLHTTP");
					};
				}
			})(),

			/*
			 * 检测请求是否为指定值，readyState,state默认值分别为4,200
			 * 参数 xhr对象，[state值]，[readyState值]
			 */
			isReady: function(xhr, status, readyState) {
				var length = arguments.length;
				if (dmc.instance(xhr, XMLHttpRequest)) {
					return length == 1 && xhr.readyState == 4 && xhr.status == 200 ||
						length == 2 && xhr.readyState == 4 && xhr.status == status ||
						length == 3 && xhr.readyState == readyState && xhr.status == status;
				}
				dmc.error("参数类型有误，第一个参数应为XMLHttpRequest类型");
			},

			/*
			 * 请求数据，成功后会将responseText存入回调函数第一个参数中
			 * 参数 请求地址，请求完成后执行的调用的函数
			 */
			get: function(url, callback) {
				if (dmc.type(url, "string") && dmc.isFunction(callback)) {
					var xhr = dmc.Ajax.createXHR();
					dmc.Event.addHandler(xhr, "readystatechange", function() {
						dmc.Ajax.isReady(xhr) && callback(xhr.responseText);
					});
					xhr.open("get", url, true);
					xhr.send();
				}
			},

			/*
			 * 请求数据，成功后会将responseText存入回调函数第一个参数中
			 * 查询字符串为空时，请用""代替
			 * 参数 请求地址，查询字符串，请求完成后执行的调用的函数
			 */
			post: function(url, data, callback) {
				if (dmc.type(url, "string") && dmc.type(data, "string") && dmc.isFunction(callback)) {
					var xhr = dmc.Ajax.createXHR();
					dmc.Event.addHandler(xhr, "readystatechange", function() {
						dmc.Ajax.isReady(xhr) && callback(xhr.responseText);
					});
					xhr.open("post", url, true);
					xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhr.send(data);
				}
			}
		}; // end of Ajax
		dmc.extend({

			/*
			 * 常用类型检测
			 */
			type: function(obj, type) {
				var length = arguments.length;
				switch (length) {
					case 0:
						dmc.error("dmc.type参数不能为空");
					case 1:
						return typeof obj;
					default: // 有两个参数时
						if (typeof type !== "string") {
							dmc.error("dmc.type参数类型错误");
						}
						return typeof obj === type;
				}
			},
			instance: function(obj, objName) {
				if (!dmc.type(obj, "undefined")) {
					return obj instanceof objName;
				}
				dmc.error("dmc.instance参数类型错误");
			},
			isUndefined: function(obj) {
				return dmc.type(obj, "undefined");
			},
			isFunction: function(obj) {
				return dmc.type(obj, "function");
			},
			isArray: function(obj) {
				return toString.call(obj) === "[object Array]";
			},
			error: function(msg) {
				throw new Error(msg);
			},

			/*
			 * 表单序列化
			 * 参数 表单元素
			 */
			serialize: function(form) {
				if (dmc.isUndefined(form) || form.nodeType != 1) {
					dmc.error("dmc.serialize参数错误");
				}
				var
					parts = [],
					opt,
					optVal = "",
					element;
				for (var i = 0, length = form.elements.length; i < length; i++) {
					element = form.elements[i];
					switch (element.type) {
						case "undefined":
						case "file":
						case "submit":
						case "reset":
						case "button":
							break;
						case "select-one":
						case "select-multiple":
							if (element.name.length) {
								for (var j = 0, optLen = element.options.length; j < optLen; j++) {
									opt = element.options[j];
									if (opt.selected) {
										optVal = opt.hasAttribute ?
											(opt.hasAttribute("value") ? opt.value : opt.text) :
											(opt.attibutes["value"].specified ? opt.value : opt.text);
										parts.push(encodeURIComponent(element.name) + "=" + encodeURIComponent(optVal));
									}
								}
							}
							break;
						case "radio":
						case "checkbox":
							if (!element.checked) { // 跳过未选择的
								break;
							}
						default:
							if (element.name.length) {
								parts.push(encodeURIComponent(element.name) + "=" + encodeURIComponent(element.value));
							}
							break;
					}
				}
				return parts.join("&");
			}
		}); // end of extend()

		/*
		 * 扩充原生对象
		 */
		Array.prototype.forEach = Array.prototype.forEach || function(fn) {
			for (var i = 0, length = context.length; i < length; i++) {
				fn(this[i], i);
			}
		};
		String.prototype.trim = String.prototype.trim || function() {
			return this.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
		};
		Function.prototype.bind = Function.prototype.bind || function(context) {
			var method = this,
				args = Array.prototype.slice.call(arguments, 1);
			return function() {
				return method.apply(context, args);
			}
		};
		return dmc;
	})(); // end of object dmc
	/*
	 * "mini" Selector Engine
	 * Copyright (c) 2009 James Padolsey
	 * -------------------------------------------------------
	 * Dual licensed under the MIT and GPL licenses.
	 *    - http://www.opensource.org/licenses/mit-license.php
	 *    - http://www.gnu.org/copyleft/gpl.html
	 * -------------------------------------------------------
	 * Version: 0.01 (BETA)
	 */
	var mini = (function() {
		var
			snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,
			exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/,
			exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/,
			exprNodeName = /^([\w\*\-_]+)/,
			na = [null, null];

		function _find(selector, context) {
			/*
			 * This is what you call via x()
			 * Starts everything off...
			 */
			context = context || document;
			var simple = /^[\w\-_#]+$/.test(selector);
			if (!simple && context.querySelectorAll) {
				return realArray(context.querySelectorAll(selector));
			}
			if (selector.indexOf(',') > -1) {
				var split = selector.split(/,/g),
					ret = [],
					sIndex = 0,
					len = split.length;
				for (; sIndex < len; ++sIndex) {
					ret = ret.concat(_find(split[sIndex], context));
				}
				return unique(ret);
			}
			var parts = selector.match(snack),
				part = parts.pop(),
				id = (part.match(exprId) || na)[1],
				className = !id && (part.match(exprClassName) || na)[1],
				nodeName = !id && (part.match(exprNodeName) || na)[1],
				collection;
			if (className && !nodeName && context.getElementsByClassName) {
				collection = realArray(context.getElementsByClassName(className));
			} else {
				collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));
				if (className) {
					collection = filterByAttr(collection, 'className', RegExp('(^|\\s)' + className + '(\\s|$)'));
				}
				if (id) {
					var byId = context.getElementById(id);
					return byId ? [byId] : [];
				}
			}
			return parts[0] && collection[0] ? filterParents(parts, collection) : collection;
		}

		function realArray(c) {
			/*
			 * Transforms a node collection into
			 * a real array
			 */
			try {
				return Array.prototype.slice.call(c);
			} catch (e) {
				var ret = [],
					i = 0,
					len = c.length;
				for (; i < len; ++i) {
					ret[i] = c[i];
				}
				return ret;
			}
		}

		function filterParents(selectorParts, collection, direct) {
			/*
			 * This is where the magic happens.
			 * Parents are stepped through (upwards) to
			 * see if they comply with the selector.
			 */
			var parentSelector = selectorParts.pop();

			if (parentSelector === '>') {
				return filterParents(selectorParts, collection, true);
			}
			var ret = [],
				r = -1,
				id = (parentSelector.match(exprId) || na)[1],
				className = !id && (parentSelector.match(exprClassName) || na)[1],
				nodeName = !id && (parentSelector.match(exprNodeName) || na)[1],
				cIndex = -1,
				node, parent,
				matches;
			nodeName = nodeName && nodeName.toLowerCase();
			while ((node = collection[++cIndex])) {
				parent = node.parentNode;
				do {
					matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();
					matches = matches && (!id || parent.id === id);
					matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));
					if (direct || matches) {
						break;
					}
				} while ((parent = parent.parentNode));
				if (matches) {
					ret[++r] = node;
				}
			}
			return selectorParts[0] && ret[0] ? filterParents(selectorParts, ret) : ret;
		}

		var unique = (function() {
			var uid = +new Date();
			var data = (function() {
				var n = 1;
				return function(elem) {
					var cacheIndex = elem[uid],
						nextCacheIndex = n++;
					if (!cacheIndex) {
						elem[uid] = nextCacheIndex;
						return true;
					}
					return false;
				};
			})();
			return function(arr) {
				/*
				 * Returns a unique array
				 */
				var length = arr.length,
					ret = [],
					r = -1,
					i = 0,
					item;
				for (; i < length; ++i) {
					item = arr[i];
					if (data(item)) {
						ret[++r] = item;
					}
				}
				uid += 1;
				return ret;
			};
		})();

		function filterByAttr(collection, attr, regex) {
			/*
			 * Filters a collection by an attribute.
			 */
			var i = -1,
				node, r = -1,
				ret = [];
			while ((node = collection[++i])) {
				if (regex.test(node[attr])) {
					ret[++r] = node;
				}
			}
			return ret;
		}
		return _find;
	})();
	// 防止冲突
	if (window.$) {
		window.dmc = dmc;
	} else {
		window.dmc = window.$ = dmc;
	}
})(window);
