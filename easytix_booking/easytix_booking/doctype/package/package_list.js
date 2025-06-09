$(() => {
	frappe.listview_settings['Package'] = {
		hide_name_column: true,
		hide_name_filter: true,
		onload: function (listview) {
			listview.page.sidebar.remove();
			listview.page.actions_btn_group.remove();
		},
	};
});