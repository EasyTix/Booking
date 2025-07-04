# Copyright (c) 2025, NetQuest Solutions Sdn Bhd and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import getdate, add_days, get_datetime, add_to_date, today

class Package(Document):

	def onload(self):
		for rule in self.date_rules:
			rule.compute_values()
			
	def before_validate(self):
		for rule in self.date_rules:
			rule.clean_values()

	def get_available_dates(self):
		available_dates = set()
		excluded_dates = set()
		
		resource = frappe.get_doc("Resource", self.resource)
		rules = resource.date_rules + self.date_rules

		for rule in rules:
			rule_type = rule.type
			rule_action = rule.rule
			
			if rule_type == "Date" and rule.start_date:
				date_str = getdate(rule.start_date).strftime("%Y-%m-%d")
				if rule_action == "Include":
					available_dates.add(date_str)
					excluded_dates.discard(date_str)
				else:  # Exclude
					excluded_dates.add(date_str)
					available_dates.discard(date_str)
			
			elif rule_type == "Date Range" and rule.start_date and rule.end_date:
				current_date = getdate(rule.start_date)
				end_date = getdate(rule.end_date)
				while current_date <= end_date:
					date_str = current_date.strftime("%Y-%m-%d")
					if rule_action == "Include":
						available_dates.add(date_str)
						excluded_dates.discard(date_str)
					else:  # Exclude
						excluded_dates.add(date_str)
						available_dates.discard(date_str)
					current_date = add_days(current_date, 1)
			
			elif rule_type == "Weekday" and rule.weekday:
				# Generate dates for the next 365 days
				start_date = get_datetime().date()
				end_date = add_to_date(start_date,1)
				current_date = start_date
				weekday_index = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].index(rule.weekday)
				
				while current_date <= end_date:
					if current_date.weekday() == weekday_index:
						date_str = current_date.strftime("%Y-%m-%d")
						if rule_action == "Include":
							available_dates.add(date_str)
							excluded_dates.discard(date_str)
						else:  # Exclude
							excluded_dates.add(date_str)
							available_dates.discard(date_str)
					current_date = add_days(current_date, 1)
		
		final_dates = sorted(list(available_dates - excluded_dates))
		if not final_dates:
			return []
		
		bookings = frappe.get_all(
			"Booking",
			filters={"package": self.name, "status": ["in", ["Approved", "Pending", "Created"] ], "booking_date": [ ">=", today() ] },
			fields=["booking_date", "SUM(quantity) as total_quantity"],
			group_by="booking_date"
		)
		
		# Map bookings to date strings
		booked_quantities = {getdate(b.booking_date).strftime("%Y-%m-%d"): b.total_quantity for b in bookings}
		
		# Build list of date-capacity dictionaries
		dates_with_capacity = {}
		for date in final_dates:
			booked = booked_quantities.get(date, 0)
			remaining = max(0, resource.capacity - booked)
			dates_with_capacity[date] = remaining
		
		return dates_with_capacity