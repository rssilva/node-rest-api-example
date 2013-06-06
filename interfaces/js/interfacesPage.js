var Page = function () {
	return {
		init: function () {
			this.select 		= $('#req-type');
			this.dataContainer 	= $('#data-container');
			this.textArea 		= this.dataContainer.find('textarea');
			this.urlInput 		= $('#url');
			this.result 		= $('#result');

			this.bindEvents();
		},

		request: function (options) {
			var self = this,
				url = options.url ? '../' + options.url : '/';
			
			options.url = url;
			
			options.success = function (data) {
				console.log('SUCESS', data)
								
				self.result.text(data);
			};

			options.error = function (data) {
				console.error(data)
			};
			console.log(options.data)
			$.ajax(options);
		},

		get: function () {
			var url = this.urlInput	.val();

			this.request({
				dataType: 'json',
				url: url
			});
		},

		post: function () {
			var url = this.urlInput.val();
			
			this.request({
				type: 'POST',
				url: url,
				data: JSON.parse(this.textArea.val())
			});
		},

		put: function () {
			var url = this.urlInput.val();
			
			this.request({
				type: 'PUT',
				url: url,
				data: JSON.parse(this.textArea.val())
			});
		},

		deleteRequisition: function () {
			var url = this.urlInput.val();

			this.request({
				type: 'DELETE',
				url: url,
				data: this.textArea.val()
			});
		},

		setMode: function (text) {
			if (text === 'GET' || text === 'DELETE') {
				this.hideDataArea();
			} else if (text === 'POST' || text === 'PUT') {
				this.showDataArea();
			}
		},

		fireRequest: function () {
			var requestType = this.select.find(":selected").val();

			switch (requestType) {
				case 'GET':
					this.get();
					break;

				case 'POST':
					this.post();
					break;

				case 'PUT':
					this.put();
					break;

				case 'DELETE':
					this.deleteRequisition();
					break;

				default:
					return null;
					break;				
			}
		},

		hideDataArea: function () {
			this.dataContainer.addClass('display-none');
		},

		showDataArea: function () {
			this.dataContainer.removeClass('display-none');
		},

		bindEvents: function () {
			var self = this;

			this.select.on('change', function () {
				self.setMode($(this).find(":selected").val());
			});

			$('#button').on('click', function () {
				self.fireRequest();
			})

			this.urlInput.on('keydown', function (ev) {
				if (ev.keyCode === 13) {
					self.fireRequest();
				}	
			})
		}
	}
}

$(function () {
	var page = new Page();
	page.init();
})