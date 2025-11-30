const express = require("express");
const {
  getAllVendors,
  getPendingVendors,
  approveVendor,
  rejectVendor,
  suspendVendor,
  deleteVendor,
  getVendorDetails,
} = require("../../controllers/admin/vendor-controller");

const router = express.Router();

// Get all vendors
router.get("/get", getAllVendors);

// Get pending vendors
router.get("/pending", getPendingVendors);

// Get vendor details
router.get("/:sellerId", getVendorDetails);

// Approve vendor
router.put("/approve/:sellerId", approveVendor);

// Reject vendor
router.put("/reject/:sellerId", rejectVendor);

// Suspend vendor
router.put("/suspend/:sellerId", suspendVendor);

// Delete vendor
router.delete("/delete/:sellerId", deleteVendor);

module.exports = router;


