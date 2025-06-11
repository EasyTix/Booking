# Copyright (c) 2025, NetQuest Solutions Sdn Bhd and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Resource(Document):
	def onload(self):
		for rule in self.date_rules:
			rule.compute_values()
			
	def before_validate(self):
		for rule in self.date_rules:
			rule.clean_values()