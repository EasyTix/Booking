frappe.ui.form.on("Booking", {
	onload: function (frm) {
		frm.set_df_property("status", "read_only", 1);
	},
	refresh: function (frm) {
		frm.fields_dict["participants"].grid.no_customize = true;
		// Prevent selecting a past date when creating a booking
		frm.fields_dict.booking_date.datepicker.update({
			minDate: new Date(frappe.datetime.get_today()),
		});

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

		if (frm.doc.status === "Rejected" || frm.doc.status === "Approved") {
			frm.fields.forEach(function (field) {
				frm.set_df_property(field.df.fieldname, "read_only", 1);
			});
		} else {
			frm.fields.forEach(function (field) {
				frm.set_df_property(field.df.fieldname, "read_only", field.df.read_only || 0);
			});
		}

		if(frm.doc.status === "Approved") {
			frm.set_df_property('participants', "read_only", 0);
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
