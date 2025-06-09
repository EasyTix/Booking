# Copyright (c) 2025, NetQuest Solutions Sdn Bhd and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Booking(Document):
    def validate(self):
        super().validate()
        package = frappe.get_doc("Package", self.package)
        
        try:
            dates_with_capacity = package.get_available_dates()
        except Exception as e:
            frappe.throw(f"Failed to retrieve available dates: {str(e)}")
        
        booking_date_str = getdate(self.booking_date).strftime("%Y-%m-%d")

        capacity_for_date = next((d[booking_date_str] for d in dates_with_capacity if booking_date_str in d), None)
        if capacity_for_date is None:
           frappe.throw(f"Booking date {booking_date_str} is not available for package '{self.package}'")