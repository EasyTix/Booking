frappe.ui.form.on("Scheduled Trips", {
    setup: function (frm) {
        const fields = frappe.meta.get_docfields( frm.get_field("bookings").grid.doctype );
        fields.forEach(field => {
            frm.get_field("bookings").grid.get_docfield(field.fieldname).in_list_view = 0;
        });

        const visible_fields = ['booking_name', 'email', 'contact_number', 'quantity', 'creation'];
        visible_fields.forEach(field => {
            frm.get_field("bookings").grid.get_docfield(field).in_list_view = 1;
            frm.get_field("bookings").grid.get_docfield(field).hidden = 0;
        });
    },
    refresh: function(frm) {
        const tables = ['variation_quantity', 'participants', 'bookings'];
        tables.forEach(table => {
            frm.fields_dict[table].grid.wrapper.show();
        });

        if (frm.doc.bookings) {
            frm.fields_dict.bookings.grid.get_data().forEach(function(row) {
                if (row.creation) {
                    let formatted_date = moment(row.creation, "YYYY-MM-DD").format("DD MMM YYYY");
                    row.creation = formatted_date;
                }
            });
            frm.fields_dict.bookings.grid.refresh();
        }

    }
});