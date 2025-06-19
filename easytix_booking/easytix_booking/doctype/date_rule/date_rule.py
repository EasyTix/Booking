# Copyright (c) 2025, NetQuest Solutions Sdn Bhd and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class DateRule(Document):
	
	def compute_values(self):
		if self.type == "Weekday":
			self.value = self.weekday or ""
		elif self.type == "Date":
			self.date_input = self.value = self.start_date or ""
		elif self.type == "Date Range":
			self.date_input = self.value = f"{self.start_date or ''} to {self.end_date or ''}"
		
	def clean_values(self):
		if self.type == "Weekday":
			self.start_date = None
			self.end_date = None
		elif self.type == "Date":
			self.weekday = None
		elif self.type == "Date Range":
			self.weekday = None
		self.value = None;
		self.date_input = None