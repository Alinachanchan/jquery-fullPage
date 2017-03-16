(function(root,factory,plug){
	factory(root.jQuery,plug);
})(window,function($,plug){
	var __PROTOTYPE__ = {
		//初始化架构层面的dom的样式，初始化一些属性
		_init : function(){
			this.$sectionWrap = this.addClass("section-wrapper")
			.find("ul:first")
			.addClass("section-wrap section-animate")
			.children("li").addClass("section").parent();
			this.$sections = this.$sectionWrap.find("li.section");
			this.index = 0;//当前页码
			this.last = this.$sections.length-1;
			this.lock = true;//用来作为锁标识

			
		},
		//生成旁边的序列按钮
		_serials : function(){
			if(!this.showSerial)return;
			this.$serials = $("<ul></ul>");
			for(var i=0;i<this.$sections.length;i++){
				this.$serials.append("<li class='"+(!i?"curr":"")+"'><a href='#'></a></li>");
			}
			this.$serials.addClass("serial");
			this.append(this.$serials);
		},
		//封装了自定义事件的触发机制
		_attachEvent : function(event,args){
			this.trigger(event,args);
		},
		_bind : function(){
			var _$this = this;//
			this.on("mousewheel",function(e){
				if(_$this.lock){
					_$this.lock = false;
					var dir = e.originalEvent.deltaY<0;
					var beforeIndex = _$this.index;
					dir?_$this.index--:_$this.index++;
					_$this.index = Math.min(_$this.index,_$this.last);
					_$this.index = Math.max(_$this.index,0);
					if(beforeIndex==_$this.index){
						_$this.lock = true;
						return;
					}
					_$this._attachEvent("beforeWheel",{
						before : beforeIndex,
						beforeDOM : _$this.$sections.eq(beforeIndex),
						after : _$this.index,
						afterDOM : _$this.$sections.eq(_$this.index)
					});
					_$this.$sectionWrap.css({
						"transform": "translateY(-"+_$this.index+"00%)",
						"-moz-transform": "translateY(-"+_$this.index+"00%)",
						"-webkit-transform": "translateY(-"+_$this.index+"00%)",
						"-o-transform": "translateY(-"+_$this.index+"00%)"
					});
					setTimeout(function(){
						_$this.lock = true;
						_$this._attachEvent("afterWheel",{
							before : beforeIndex,
							beforeDOM : _$this.$sections.eq(beforeIndex),
							after : _$this.index,
							afterDOM : _$this.$sections.eq(_$this.index)
						});
						_$this.$serials
							.children()
							.eq(_$this.index)
							.addClass("curr")
							.siblings()
							.removeClass("curr");
					},1000);
				}
			});
		}
	};
	var __DEFAULTS__ = {
		showSerial : true//是否显示serial按钮
	}; 
	$.fn[plug] = function(options){
		//扩展功能
		$.extend(this,__PROTOTYPE__,__DEFAULTS__,options);
		this._init();//初始化
		this._serials();//生成序列
		this._bind();//设置功能事件
		return this;
	}
},"fullPage");
