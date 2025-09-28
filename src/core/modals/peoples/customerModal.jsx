import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import config from "../../../config";

const CustomerModal = () => {
  const MySwal = withReactContent(Swal);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phoneNumber: "",
    address: "",
    gstNo: "",
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${config.Backendurl}/addcustomer`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      MySwal.fire({
        title: "Sucess",
        text: "Customer Inserted Sucessfully !",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-success",
        },
      });


      // Reset form
      setFormData({
        companyName: "",
        email: "",
        phoneNumber: "",
        address: "",
        gstNo: "",
      });

      window.location.reload()
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add customer ❌");
    }
  };

  return (
    <>
      {/* Add Customer */}
      <div className="modal fade" id="add-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Customer</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-4 pe-0">
                        <div className="mb-3">
                          <label className="form-label">Company Name </label>
                          <input
                            type="text"
                            name="companyName"
                            className="form-control"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 pe-0">
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
                      </div>
                      <div className="col-lg-4 pe-0">
                        <div className="input-blocks">
                          <label className="mb-2">Phone</label>
                          <input
                            type="text"
                            name="phoneNumber"
                            className="form-control form-control-lg group_formcontrol"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 pe-0">
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
                      </div>
                      <div className="col-lg-6 pe-0">
                        <div className="mb-3">
                          <label className="form-label">GST No : </label>
                          <input
                            type="text"
                            name="gstNo"
                            className="form-control"
                            value={formData.gstNo}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Customer */}
    </>
  );
};

export default CustomerModal;
