frappe.ui.form.on("Scheduled Trips", {
    setup: function (frm) {
        console.log("a");
        
        const fields = frappe.meta.get_docfields( frm.get_field("bookings").grid.doctype );
        fields.forEach(field => {
            frm.get_field("bookings").grid.get_docfield(field.fieldname).in_list_view = 0;
        });

        const visible_fields = ['booking_name', 'email', 'contact_number', 'quantity'];
        visible_fields.forEach(field => {
            frm.get_field("bookings").grid.get_docfield(field).in_list_view = 1;
        });
    }
});