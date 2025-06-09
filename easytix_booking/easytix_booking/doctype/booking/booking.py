# Copyright (c) 2025, NetQuest Solutions Sdn Bhd and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Booking(Document):
    def validate(self):
        if self.status == "Created" :
            package = frappe.get_doc("Package", self.package)
            
            try:
                dates_with_capacity = package.get_available_dates()
            except Exception as e:
                frappe.throw(f"Failed to retrieve available dates: {str(e)}")
            
            dd = self.booking_date.strftime("%Y-%m-%d")
            capacity_for_date = dates_with_capacity[dd]

            if capacity_for_date is None:
                frappe.throw(f"Booking date {self.booking_date} is not available for package '{self.package}'")
            
            if capacity_for_date < self.quantity:
                frappe.throw(f"Booking quantity for {self.booking_date} is insufficient for package '{self.package}'")