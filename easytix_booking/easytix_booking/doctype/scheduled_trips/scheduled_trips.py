import frappe
from frappe.model.document import Document
import json

class ScheduledTrips(Document):

    @staticmethod
    def simple_filters_to_dict(filters):
        """Convert list-style filters with '=' into a plain dict."""
        out = {}
        for f in filters:
            if len(f) == 4 and f[2] == "=":
                _, fieldname, _, value = f
                out[fieldname] = value
        return out

    @staticmethod
    def get_list(args=None):
        args = args or {}
        limit_start = int(args.get("limit_start", 0))
        limit_page_length = int(args.get("limit_page_length", 20))

        conditions = []
        values = []

        filters = args.get("filters", [])
        if isinstance(filters, str):
            filters = json.loads(filters)

        if isinstance(filters, list):
            filters = ScheduledTrips.simple_filters_to_dict(filters)

        if filters.get("package"):
            conditions.append("b.package = %s")
            values.append(filters["package"])

        if filters.get("booking_date"):
            conditions.append("b.booking_date = %s")
            values.append(filters["booking_date"])

        condition_sql = f" AND {' AND '.join(conditions)}" if conditions else ""

        sql = f"""
            SELECT
                b.name as name,
                b.booking_date,
                p.package_name as package,
                p.resource,
                r.resource_name,
                r.capacity AS capacity, 
                SUM(b.quantity) AS quantity
            FROM `tabBooking` b
            INNER JOIN `tabPackage` p ON p.name = b.package
            INNER JOIN `tabResource` r ON r.name = p.resource
            WHERE b.status = 'Approved' {condition_sql}
            GROUP BY b.package, b.booking_date
            ORDER BY b.booking_date ASC, p.package_name ASC
            LIMIT %s OFFSET %s
        """

        values.extend([limit_page_length, limit_start])
        results = frappe.db.sql(sql, values, as_dict=True)
        
        for row in results:
            row["id"] = f"{row['package']}-{row['booking_date']}"
            
        return results

    @staticmethod
    def get_count(args=None):
        args = args or {}
        conditions = []
        values = []

        filters = args.get("filters", [])
        if isinstance(filters, str):
            filters = json.loads(filters)

        if isinstance(filters, list):
            filters = ScheduledTrips.simple_filters_to_dict(filters)

        if filters.get("package"):
            conditions.append("b.package = %s")
            values.append(filters["package"])

        if filters.get("booking_date"):
            conditions.append("b.booking_date = %s")
            values.append(filters["booking_date"])

        condition_sql = f" AND {' AND '.join(conditions)}" if conditions else ""

        sql = f"""
            SELECT COUNT(*) FROM (
                SELECT 1
                FROM `tabBooking` b
                WHERE b.status = 'Approved' {condition_sql}
                GROUP BY b.package, b.booking_date
            ) AS subquery
        """

        count = frappe.db.sql(sql, values)[0][0]
        return count

    def load_from_db(self):
        row_doc = frappe.db.get_value(
            "Booking",
            {
                "status": "Approved",
                "name": self.name
            },
            "*"
        )

        if not row_doc:
            frappe.throw("Scheduled Trip not found")

        #frappe.log_error(f"Load failed: {package}", "Employee Load")
        #frappe.throw(f"Record Dump: {row_doc}")

        package_doc = frappe.get_doc("Package", row_doc.package)
        resource_doc = frappe.get_doc("Resource", package_doc.resource)
        bookings_doc = frappe.db.get_all(
            "Booking",
            filters={
                "status": "Approved",
                "booking_date": row_doc.booking_date,
                "package": row_doc.package
            },
            fields="*"
        )
        participants_doc = frappe.db.get_all(
            "Booking Participant",
            filters={
                "parent": ["in",  [r["name"] for r in bookings_doc]],
                "parenttype": "Booking"
            },
            fields="*"
        )
        total_quantity = sum([b["quantity"] for b in bookings_doc])

        super(Document, self).__init__({
            "doctype": "Scheduled Trips",
            "name": self.name,
            "booking_date": row_doc.booking_date,
            "package": row_doc.package,
            "capacity": resource_doc.capacity,
            "quantity": total_quantity,
            "bookings" : bookings_doc,
            "participants" : participants_doc
        })