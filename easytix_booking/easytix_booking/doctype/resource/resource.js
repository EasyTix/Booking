frappe.ui.form.on('Date Rule', {
    form_render: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row.type == "Date Range") {
            if (row.value) {
                row.date_input = row.start_date;
            } else {
                frm.get_field("date_rules").grid.get_row(cdn).get_field("date_input").datepicker.clear();
            }
            frm.get_field("date_rules").grid.get_row(cdn).get_field("date_input").datepicker.update({
                range: 1,
                minDate: new Date(frappe.datetime.get_today()),
                multipleDatesSeparator: " to ",
                onSelect: function(date, formattedDate, datepicker) {
                    if (datepicker.visible && row.type == "Date Range" && (formattedDate.length > 1)) {
                        let d = datepicker.formatDate("yyyy-mm-dd", formattedDate[0]);
                        frm.get_field("date_rules").grid.get_row(cdn).get_field("start_date").set_value(d);
                        frappe.model.set_value(cdt, cdn, "start_date", d)
                        row.start_date = d;

                        let d2 = datepicker.formatDate("yyyy-mm-dd", formattedDate[1]);
                        frm.get_field("date_rules").grid.get_row(cdn).get_field("end_date").set_value(d2);
                        frappe.model.set_value(cdt, cdn, "end_date", d2)
                        row.end_date = d2;

                        row.value = row.start_date + this.multipleDatesSeparator + row.end_date;
                        row.date_input = row.value;
                    }
                }
            });
            frm.get_field("date_rules").grid.get_row(cdn).get_field("date_input").datepicker.clear();
            frm.get_field("date_rules").grid.get_row(cdn).get_field("date_input").datepicker.selectDate([new Date(row.start_date), new Date(row.end_date)]);
        } else if (row.type == "Date") {
            if (row.value) {
                row.date_input = row.start_date;
            } else {
                frm.get_field("date_rules").grid.get_row(cdn).get_field("date_input").datepicker.clear();
            }
            frm.get_field("date_rules").grid.get_row(cdn).get_field("date_input").datepicker.update({
                range: 0,
                minDate: new Date(frappe.datetime.get_today()),
                onSelect: function(date, formattedDate, datepicker) {
                    if (datepicker.visible && row.type == "Date") {
                       let d = datepicker.formatDate("yyyy-mm-dd", formattedDate);
                        frm.get_field("date_rules").grid.get_row(cdn).get_field("start_date").set_value(d);
                        frappe.model.set_value(cdt, cdn, "start_date", d)
                        row.start_date = d;
                        row.value = row.start_date;
                        row.date_input = row.value;
                        frm.get_field("date_rules").grid.get_row(cdn).get_field("date_input").set_value(row.value);
                    }
                }
            });
        }
    },
    weekday: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row.type == "Weekday") {
            row.value = row.weekday;
        }
    },
    date_input: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row.type == "Date Range") {
            row.value = row.start_date + frm.get_field("date_rules").grid.get_row(cdn).get_field("date_input").datepicker.opts.multipleDatesSeparator + row.end_date;
        } else if (row.type == "Date") {
            row.value = row.date_input;
        }
    },
    type: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row.type == "Date Range") {
            frm.get_field("date_rules").grid.get_row(cdn).get_field("date_input").datepicker.update({
                range: 1,
                minDate: new Date(frappe.datetime.get_today()),
                multipleDatesSeparator: " to ",
                selectedDates: [new Date(row.start_date), new Date(row.end_date)],
                onSelect: function(date, formattedDate, datepicker) {
                    if (datepicker.visible && row.type == "Date Range" && (formattedDate.length > 1)) {
                        let d = datepicker.formatDate("yyyy-mm-dd", formattedDate[0]);
                        frm.get_field("date_rules").grid.get_row(cdn).get_field("start_date").set_value(d);
                        frappe.model.set_value(cdt, cdn, "start_date", d)
                        row.start_date = d;

                        let d2 = datepicker.formatDate("yyyy-mm-dd", formattedDate[1]);
                        frm.get_field("date_rules").grid.get_row(cdn).get_field("end_date").set_value(d2);
                        frappe.model.set_value(cdt, cdn, "end_date", d2)
                        row.end_date = d2;

                        row.value = row.start_date + this.multipleDatesSeparator + row.end_date;
                        row.date_input = row.value;
                    }
                }
            });
        } else if (row.type == "Date") {
            frm.get_field("date_rules").grid.get_row(cdn).get_field("date_input").datepicker.update({
                range: 0,
                minDate: new Date(frappe.datetime.get_today()),
                onSelect: function(date, formattedDate, datepicker) {
                    if (datepicker.visible && row.type == "Date") {
                        let d = datepicker.formatDate("yyyy-mm-dd", formattedDate);
                        frm.get_field("date_rules").grid.get_row(cdn).get_field("start_date").set_value(d);
                        frappe.model.set_value(cdt, cdn, "start_date", d)
                        row.value = row.start_date;
                        row.date_input = row.value;
                    }
                }
            });
        }
    }
});