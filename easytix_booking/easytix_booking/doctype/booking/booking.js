frappe.ui.form.on("Booking", {
	onload: function (frm) {
		if (frm.doc.__islocal) return;
		let fields = [
			"booking_name",
			"email",
			"contact_number",
			"booking_date",
			"status",
			"quantity",
		];
		fields.forEach((f) => frm.set_df_property(f, "read_only", 1));
	},
	refresh: function (frm) {
		frm.fields_dict["participants"].grid.no_customize = true;

		// Prevent selecting a past date when creating a booking
		if (frm.is_new()) {
			frm.fields_dict.booking_date.datepicker.update({
				minDate: new Date(frappe.datetime.get_today()),
			});
		}

		//Approve or Reject Booking
		if (
			!frm.is_new() &&
			frm.doc.status === "Pending" &&
			frappe.user.has_role("System Manager")
		) {
			frm.add_custom_button("Approve", () => {
				frm.set_value("status", "Approved");
				frm.save();
			});
			frm.add_custom_button("Reject", () => {
				frm.set_value("status", "Rejected");
				frm.save();
			});
		}
	},
	quantity: function (frm) {
		// Clear the Participants table first
		frm.clear_table("participants");

		// Get the value of the Quantity field
		let quantity = frm.doc.quantity;

		// Add 'quantity' number of rows to the Participants table
		for (let i = 0; i < quantity; i++) {
			frm.add_child("participants", {
				status: "Not Boarded", // Default status to "Pending"
			});
		}

		// Refresh the Participants table
		frm.refresh_field("participants");
	},
});

frappe.ui.form.on("Booking Participant", {
	participants_add: function (frm, cdt, cdn) {
		// Get the current number of rows in the participants table
		let current_rows = frm.doc.participants ? frm.doc.participants.length : 0;
		// Get the quantity value
		let quantity = frm.doc.quantity || 0;

		// Check if adding the new row exceeds the quantity
		if (current_rows > quantity) {
			// Remove the newly added row
			frm.get_field("participants").grid.grid_rows_by_docname[cdn].remove();
			frm.refresh_field("participants");
			frappe.msgprint({
				title: __("Warning"),
				indicator: "orange",
				message: __(
					"Cannot add more participants. The limit is {0} based on the specified quantity.",
					[quantity]
				),
			});
		}
	},
});
