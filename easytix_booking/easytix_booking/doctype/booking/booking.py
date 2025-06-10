# Copyright (c) 2025, NetQuest Solutions Sdn Bhd and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import datetime 

class Booking(Document):
	# def load_from_db(self):
	#     super().load_from_db()
		
	#     fields = ["booking_name", "email","contact_number", "booking_date","status", "quantity"]
	#     if(self.status in ["Pending", "Approved", "Rejected"]):
	#         for field in fields:
	#             self.set_field_read_only(field,True)
	#     else :
	#         for field in fields:
	#             self.set_field_read_only(field,False)
		
	# def set_field_read_only(self, fieldname, value):
	#     for field in self.meta.fields:
	#         if field.fieldname == fieldname:
	#             field.read_only = value

	def validate(self):
		if self.is_new():
			package = frappe.get_doc("Package", self.package)
			
			try:
				dates_with_capacity = package.get_available_dates()
			except Exception as e:
				frappe.throw(f"Failed to retrieve available dates: {str(e)}")
			
			dd = ""
			if(isinstance(self.booking_date, datetime.date) ) :
				dd = self.booking_date.strftime("%Y-%m-%d")
			else :
				dd = self.booking_date
			capacity_for_date = dates_with_capacity[dd]

			if capacity_for_date is None:
				frappe.throw(f"Booking date {self.booking_date} is not available for package '{self.package}'")
			
			if capacity_for_date < self.quantity:
				frappe.throw(f"Booking quantity for {self.booking_date} is insufficient for package '{self.package}'")