/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap"; 
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import config from "../../../config";

const CustomereditModal = ({ show, onClose, editCustomer, onSuccess }) => {
  const MySwal = withReactContent(Swal);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phoneNumber: "",
    address: "",
    gstNo: "",
  });

  // Pre-fill form when editing OR reset when closed
  useEffect(() => {
    if (show) {
      if (editCustomer) {
        setFormData({
          companyName: editCustomer.companyName || "",
          email: editCustomer.email || "",
          phoneNumber: editCustomer.phoneNumber || "",
          address: editCustomer.address || "",
          gstNo: editCustomer.gstNo || "",
        });
      } else {
        setFormData({
          companyName: "",
          email: "",
          phoneNumber: "",
          address: "",
          gstNo: "",
        });
      }
    }
  }, [show, editCustomer]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (editCustomer) {
        await axios.put(
          `${config.Backendurl}/V1/updatecustomer/${editCustomer._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        MySwal.fire({
          title: "Sucess",
          text: "Customer Updated Sucessfully !",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      } else {
        await axios.post(`${config.Backendurl}/V1/addcustomer`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Customer added successfully ✅");
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed ❌");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static" // prevent closing when clicking outside
    >
      <Modal.Header closeButton>
        <Modal.Title>{editCustomer ? "Edit Customer" : "Add Customer"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              name="companyName"
              className="form-control"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              className="form-control"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">GST No</label>
            <input
              type="text"
              name="gstNo"
              className="form-control"
              value={formData.gstNo}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editCustomer ? "Save Changes" : "Submit"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CustomereditModal;
