import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import datetime

@frappe.whitelist()
def get_all_packages():
    """
    Retrieve all packages with their details.
    Returns: List of packages with fields: package_name, package_name, requires_confirmation, requires_confirmation
    """
    try:
        packages = frappe.get_all(
            "Package",
            fields=["name", "package_name", "requires_confirmation"],
            order_by="creation desc"
        )
        return {
            "status": "success",
            "data": packages,
            "message": f"Retrieved {len(packages)} packages"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to fetch packages: {str(e)}",
            "data": []
        }

@frappe.whitelist()
def get_package_by_name(name):
    """
    Fetch a package by its package_name and include available dates from date_rules.
    Args:
        package_name (str): Name of the package.
    Returns: Package details with an additional 'available_dates' field.
    """
    try:
        if not name:
            raise ValueError("Package name is required")
        
        # Fetch the package
        package = frappe.get_doc("Package", name)
        if not package:
            return {
                "status": "error",
                "message": f"Package '{name}' not found",
                "data": {}
            }
        
        # Prepare package data
        package_data = {
            "name": package.name,
            "package_name": package.package_name,
            "requires_confirmation": package.requires_confirmation,
            "resource": package.resource,
            "available_dates": package.get_available_dates()
        }

        return {
            "status": "success",
            "data": package_data,
            "message": "Package details fetched successfully"
        }
    except frappe.DoesNotExistError:
        return {
            "status": "error",
            "message": f"Package '{name}' not found",
            "data": {}
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to fetch package: {str(e)}",
            "data": {}
        }
