$(() => {
	frappe.listview_settings["Booking"] = {
		hide_name_column: true,
		hide_name_filter: true,
		onload: function (listview) {
			listview.page.sidebar.remove();
			listview.page.actions_btn_group.remove();
		},
		formatters: {
			booking_date: function (value) {
				if (value) {
					return moment(value, "YYYY-MM-DD").format("DD MMM YYYY");
				}
				return "";
			},
			creation: function (value) {
				if (value) {
					return moment(value, "YYYY-MM-DD").format("DD MMM YYYY");
				}
				return "";
			}
		}
	};
});
