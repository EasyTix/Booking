import frappe
from frappe.utils import now_datetime, add_minutes

def expire_bookings():
    cutoff_time = add_minutes(now_datetime(), -15)
    bookings = frappe.get_all("Booking", 
        filters={"creation": ["<", cutoff_time], "status": ["!=", "Cancelled"]}, 
        fields=["name"]
    )
    
    for b in bookings:
        doc = frappe.get_doc("Booking", b.name)
        doc.cancel()
        doc.save()

    frappe.db.commit()
