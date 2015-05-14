//立即执行的函数表达式
(function(){
	//定义全局变量_$存储window.$
	var window = this,
		_$ = window.$,
		_Amy = window._Amy,
		DOC = document,
		W3C = DOC.dispatchEvent,	  //判断浏览器
		html = DOC.documentElement,  //HTML元素
		head = DOC.head,			//head元素
		rword = /[^,]+/g,          //匹配除 ","以外的东西
		class2type = {
			"[object HTMLDocument]":"Document",
			"[object HTMLCollection]":"NodeList",
			"[object StaticNodeList]":"NodeList",
			"[object DOMWindow]":"Window",
			"[object global]":"Window",
			"null":"Null",
			"NaN":"NaN",
			"undefined":"Undefined"
		},
		toString = class2type.toString();

	"Boolean,Number,String,Function,Array,Date,RegExp,Window,Document,Arguments,NodeList"
	.replace(rword,function(name){
		class2type["[object " + name+"]"] = name;
	});
		
	Amy = window.Amy = window.$ = function(selector){
		return new Amy.fn.init(selector);
	};
	
	//选择器初始化querySelector
	Amy.fn = Amy.prototype = {
		init:function(selector){
			var dom = document.querySelector(selector);
			return dom;
		}
	};
	
	Amy.fn.init.prototype = Amy.fn;
	
	//对象扩展(原型方法)
	Amy.extend = Amy.fn.extend = function(obj,prop){
		if(!prop){
			prop = obj;
			obj = this;
		}
		for(var attr in prop){
			obj[attr] = prop[attr];
		}
	};
	
	Amy.extend({
		html : html,
		head :head,
		
		/**
		 * 多库并存问题
		 */
		noConflict:function(deep){
			window.$ = _$;
			if(deep)
				window.Amy = _Amy;
			
			return Amy;
		},
		/**
		 *数组化 
		 */
		toArray:function(){
			return [].slice.call(arguments);
		},
		repeat:(function(){
			var join = Array.prototype.join,
				obj = {};
			return function(target,n){
				obj.length = n + 1;
				return join.call(obj,target);
			};
		})(),
		/**
		 * 事件绑定
		 */
		bind:W3C?function(el,type,fn,bool){
			el.addEventListener(type,fn || $.noop,!!bool);
			return fn;
		} : function(el,type,fn){
			el.attachEvent("on"+type,fn || $.noop);
			return fn;
		},
		/**
		 * 解绑事件
		 */
		unbind:W3C?function(el,type,fn,bool){
			el.removeEventListener(type,fn,!!bool);
		} : function(el,type,fn){
			el.detachEvent("on"+type,fn);
		},
		 /**
         * 用于取得数据的类型（一个参数的情况下）或判定数据的类型（两个参数的情况下）
         * @param {Any} obj 要检测的东西
         * @param {String} str ? 要比较的类型
         * @return {String|Boolean}
         * @api public
         */
		type:function(obj,str){
			var result = class2type[(obj != obj || obj == null)?obj:Object.prototype.toString.call(obj)] || obj.nodeName || "#";
			
			if(result.charAt(0) === "#"){
				if(obj == obj.document && obj.document != obj){
					result = "Window";
				}else if(obj.nodeType === 9){
					result = 'Document';
				}else if(obj.callee){
					result = "Arguments";
				}else if(isFinite(obj.length) && obj.item){
					result = "NodeList";
				}else{
					result = Object.prototype.toString.call(obj).slice(8,-1);
				}
			}
			if(str){
				return str === result;
			}
			return result;
		},
		noop:function(){
			
		},
		//字符串操作
		
		/**
		 * 字符串所占字节数
		 */
		btyeLen:function(target){
			var byteLength = target.length;
			for(var i = 0,len = target.length;i<len;i++){
				if(target.charCodeAt(i) > 255)   //若为中文则加1
					byteLength++;
			}
			return byteLength;
		},
		/**
		 *字符串截取，当超过限定时默认添加三个... 
		 */
		truncate : function(target,length,text){
			length = length || 30;
			text = text === void 0?"...":text;
			return target.length > length?
					target.slice(0,length - text.length) + text:String(target);
		},
		capitalize:function(target){
			return target.charAt(0).toUpperCase() + target.slice(1).toLowerCase();
		},
		/**
		 * 去除字符串开头和结尾空格
		 */
		trim : function(str){
			return str.replace(/^\s+|\s+$/g,"");
		},
		
		//数组操作
		/**
		 * 判断目标中是否包含一个数（数组或字符串）
		 */
		contains : function(target,index){
			return target.indexOf(index) > -1;
		},
		/**
		 * 删除目标（数组）指定位置的一个数(返回bool)
		 */
		removeAt:function(target,index){
			return !!target.splice(index,1).length;
		},
		/**
		 *删除目标（数组）中第一次出现的数
		 */
		remove:function(target,item){
			var index = target.indexOf(item);
			if(index > -1){
				return !!target.splice(index,1);
			}
			return false;
		},
		/**
		 * 从目标（数组）随机抽取一个数
		 */
		random:function(target){
			return target[(Math.random()*target.length)|0];
		},
		/**
		 * 数组平坦化操作
		 * 命名函数表达式，fla只在函数内有定义，这里用递归
		 */
		flatten:function fla(target){  
			var result = [];
			target.forEach(function(item){
				if(Array.isArray(item)){
					result = result.concat(fla(item));
				}else{
					result.push(item);
				}
			});
			return result;
		},
		/**
		 * 删除数组中null和undefined
		 * 利用filter过滤操作  //返回true值
		 */
		compact:function(target){
			var result = target.filter(function(item){
				return item != null;
			});
			return result;
		},
		max:function(target){
			return Math.max.apply(0, target);
		},
		min:function(target){
			return Math.min.apply(0,target);
		},
		//数值扩展
		/**
		 * 确保数值在[n1,n2]之间
		 */
		limit:function(target,n1,n2){
			var arr = [n1,n2].sort();
			if(target < arr[0]){
				target = arr[0];
			}
			if(target > arr[1]){
				target = arr[1];
			}
			return target;
		},
		iterator:function iter(n,type){
			if(typeof type == "undefined" || type == "*"){
				return n==0 ? 1:n*iter(n-1);
			}else if(type == "+"){
				return n==0 ? 1:n+iter(n-1);
			}
		},
		/**
		 * 求距离目标最近的数
		 */
		near : function(target,n1,n2){
			var diff1 = Math.abs(target - n1),
				diff2 = Math.abs(target - n2);
			return diff1 < diff2?n1:n2;
		},
		/**
		 * 复制数组
		 * 一般不希望别人访问原数组进行修改
		 */
		clone:function(target){
			if(this.type(target) == "Array"){
				var arr = new Array(target.length);
				for(var i = 0,len = target.length;i<len;i++){
					arr[i] = target[i];
				}
				return arr;
			}else{
				return 0;
			}
		}
			
	});
})();
