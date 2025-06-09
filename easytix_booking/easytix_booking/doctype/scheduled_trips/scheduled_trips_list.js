$(() => {
	frappe.listview_settings["Scheduled Trips"] = {
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
			capacity: function (value, df, doc) {
				const capacity_map = [
					{ threshold: 100, color: "red" },
					{ threshold: 75, color: "yellow" },
					{ threshold: 1, color: "green" },
				];

				let percentage = (doc.quantity / value) * 100;
				const indicator = capacity_map.find(function (item) {
					return percentage >= item.threshold;
				});
				return `<span class="indicator-pill ${indicator.color}">${doc.quantity} / ${value || 0}</span> `;
			},
		}
	};
});
