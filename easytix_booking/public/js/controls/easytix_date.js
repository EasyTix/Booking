frappe.ui.form.ControlDate = class ControlEasytixDate extends frappe.ui.form.ControlDate {
    set_formatted_input(value) {
        if (value === "Today") {
            value = this.get_now_date();
        }

        super.set_formatted_input(value);
        if (this.timepicker_only) return;
        if (!this.datepicker) return;
        if (!value) {
            this.datepicker.clear();
            return;
        }

        let should_refresh = this.last_value && this.last_value !== value;

        if (!should_refresh) {
            if (this.datepicker.selectedDates.length > 0) {
                // if date is selected but different from value, refresh
                const selected_date = moment(this.datepicker.selectedDates[0]).format(
                    this.date_format
                );

                should_refresh = selected_date !== value;
            } else {
                // if datepicker has no selected date, refresh
                should_refresh = true;
            }
        }

        if (should_refresh) {
            if (this.datepicker.opts.range || this.datepicker.opts.multipleDates) {
                this.datepicker.selectDate(
                    value
                    .split(this.datepicker.opts.multipleDatesSeparator)
                    .map((x) => frappe.datetime.str_to_obj(x))
                );
            } else {
                this.datepicker.selectDate(frappe.datetime.str_to_obj(value));
            }
        }
    }
};