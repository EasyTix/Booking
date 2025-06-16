import frappe
from frappe.utils import now, add_to_date

def expire_bookings():
    cutoff_time = add_to_date(now(), minutes=-15)
    bookings = frappe.get_all("Booking", 
        filters={"creation": ["<", cutoff_time], "status": "Created"}, 
        fields=["name"]
    )
    
    for b in bookings:
        doc = frappe.get_doc("Booking", b.name)
        doc.cancel()
        doc.save()

    frappe.db.commit()
